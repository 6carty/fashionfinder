package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static team.bham.web.rest.TestUtil.sameInstant;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.Weather;
import team.bham.repository.WeatherRepository;

/**
 * Integration tests for the {@link WeatherResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WeatherResourceIT {

    private static final ZonedDateTime DEFAULT_DATETIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATETIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_WEATHER_CODE = "AAAAAAAAAA";
    private static final String UPDATED_WEATHER_CODE = "BBBBBBBBBB";

    private static final Double DEFAULT_MAX_TEMPERATURE = 1D;
    private static final Double UPDATED_MAX_TEMPERATURE = 2D;

    private static final Double DEFAULT_MIN_TEMPERATURE = 1D;
    private static final Double UPDATED_MIN_TEMPERATURE = 2D;

    private static final Double DEFAULT_PRECIPITATION = 1D;
    private static final Double UPDATED_PRECIPITATION = 2D;

    private static final Double DEFAULT_WIND_SPEED = 1D;
    private static final Double UPDATED_WIND_SPEED = 2D;

    private static final String DEFAULT_WIND_DIRECTION = "AAAAAAAAAA";
    private static final String UPDATED_WIND_DIRECTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/weathers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WeatherRepository weatherRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWeatherMockMvc;

    private Weather weather;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Weather createEntity(EntityManager em) {
        Weather weather = new Weather()
            .datetime(DEFAULT_DATETIME)
            .weatherCode(DEFAULT_WEATHER_CODE)
            .maxTemperature(DEFAULT_MAX_TEMPERATURE)
            .minTemperature(DEFAULT_MIN_TEMPERATURE)
            .precipitation(DEFAULT_PRECIPITATION)
            .windSpeed(DEFAULT_WIND_SPEED)
            .windDirection(DEFAULT_WIND_DIRECTION);
        return weather;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Weather createUpdatedEntity(EntityManager em) {
        Weather weather = new Weather()
            .datetime(UPDATED_DATETIME)
            .weatherCode(UPDATED_WEATHER_CODE)
            .maxTemperature(UPDATED_MAX_TEMPERATURE)
            .minTemperature(UPDATED_MIN_TEMPERATURE)
            .precipitation(UPDATED_PRECIPITATION)
            .windSpeed(UPDATED_WIND_SPEED)
            .windDirection(UPDATED_WIND_DIRECTION);
        return weather;
    }

    @BeforeEach
    public void initTest() {
        weather = createEntity(em);
    }

    @Test
    @Transactional
    void createWeather() throws Exception {
        int databaseSizeBeforeCreate = weatherRepository.findAll().size();
        // Create the Weather
        restWeatherMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(weather)))
            .andExpect(status().isCreated());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeCreate + 1);
        Weather testWeather = weatherList.get(weatherList.size() - 1);
        assertThat(testWeather.getDatetime()).isEqualTo(DEFAULT_DATETIME);
        assertThat(testWeather.getWeatherCode()).isEqualTo(DEFAULT_WEATHER_CODE);
        assertThat(testWeather.getMaxTemperature()).isEqualTo(DEFAULT_MAX_TEMPERATURE);
        assertThat(testWeather.getMinTemperature()).isEqualTo(DEFAULT_MIN_TEMPERATURE);
        assertThat(testWeather.getPrecipitation()).isEqualTo(DEFAULT_PRECIPITATION);
        assertThat(testWeather.getWindSpeed()).isEqualTo(DEFAULT_WIND_SPEED);
        assertThat(testWeather.getWindDirection()).isEqualTo(DEFAULT_WIND_DIRECTION);
    }

    @Test
    @Transactional
    void createWeatherWithExistingId() throws Exception {
        // Create the Weather with an existing ID
        weather.setId(1L);

        int databaseSizeBeforeCreate = weatherRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWeatherMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(weather)))
            .andExpect(status().isBadRequest());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDatetimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = weatherRepository.findAll().size();
        // set the field null
        weather.setDatetime(null);

        // Create the Weather, which fails.

        restWeatherMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(weather)))
            .andExpect(status().isBadRequest());

        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkWeatherCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = weatherRepository.findAll().size();
        // set the field null
        weather.setWeatherCode(null);

        // Create the Weather, which fails.

        restWeatherMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(weather)))
            .andExpect(status().isBadRequest());

        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllWeathers() throws Exception {
        // Initialize the database
        weatherRepository.saveAndFlush(weather);

        // Get all the weatherList
        restWeatherMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weather.getId().intValue())))
            .andExpect(jsonPath("$.[*].datetime").value(hasItem(sameInstant(DEFAULT_DATETIME))))
            .andExpect(jsonPath("$.[*].weatherCode").value(hasItem(DEFAULT_WEATHER_CODE)))
            .andExpect(jsonPath("$.[*].maxTemperature").value(hasItem(DEFAULT_MAX_TEMPERATURE.doubleValue())))
            .andExpect(jsonPath("$.[*].minTemperature").value(hasItem(DEFAULT_MIN_TEMPERATURE.doubleValue())))
            .andExpect(jsonPath("$.[*].precipitation").value(hasItem(DEFAULT_PRECIPITATION.doubleValue())))
            .andExpect(jsonPath("$.[*].windSpeed").value(hasItem(DEFAULT_WIND_SPEED.doubleValue())))
            .andExpect(jsonPath("$.[*].windDirection").value(hasItem(DEFAULT_WIND_DIRECTION)));
    }

    @Test
    @Transactional
    void getWeather() throws Exception {
        // Initialize the database
        weatherRepository.saveAndFlush(weather);

        // Get the weather
        restWeatherMockMvc
            .perform(get(ENTITY_API_URL_ID, weather.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(weather.getId().intValue()))
            .andExpect(jsonPath("$.datetime").value(sameInstant(DEFAULT_DATETIME)))
            .andExpect(jsonPath("$.weatherCode").value(DEFAULT_WEATHER_CODE))
            .andExpect(jsonPath("$.maxTemperature").value(DEFAULT_MAX_TEMPERATURE.doubleValue()))
            .andExpect(jsonPath("$.minTemperature").value(DEFAULT_MIN_TEMPERATURE.doubleValue()))
            .andExpect(jsonPath("$.precipitation").value(DEFAULT_PRECIPITATION.doubleValue()))
            .andExpect(jsonPath("$.windSpeed").value(DEFAULT_WIND_SPEED.doubleValue()))
            .andExpect(jsonPath("$.windDirection").value(DEFAULT_WIND_DIRECTION));
    }

    @Test
    @Transactional
    void getNonExistingWeather() throws Exception {
        // Get the weather
        restWeatherMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWeather() throws Exception {
        // Initialize the database
        weatherRepository.saveAndFlush(weather);

        int databaseSizeBeforeUpdate = weatherRepository.findAll().size();

        // Update the weather
        Weather updatedWeather = weatherRepository.findById(weather.getId()).get();
        // Disconnect from session so that the updates on updatedWeather are not directly saved in db
        em.detach(updatedWeather);
        updatedWeather
            .datetime(UPDATED_DATETIME)
            .weatherCode(UPDATED_WEATHER_CODE)
            .maxTemperature(UPDATED_MAX_TEMPERATURE)
            .minTemperature(UPDATED_MIN_TEMPERATURE)
            .precipitation(UPDATED_PRECIPITATION)
            .windSpeed(UPDATED_WIND_SPEED)
            .windDirection(UPDATED_WIND_DIRECTION);

        restWeatherMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWeather.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWeather))
            )
            .andExpect(status().isOk());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeUpdate);
        Weather testWeather = weatherList.get(weatherList.size() - 1);
        assertThat(testWeather.getDatetime()).isEqualTo(UPDATED_DATETIME);
        assertThat(testWeather.getWeatherCode()).isEqualTo(UPDATED_WEATHER_CODE);
        assertThat(testWeather.getMaxTemperature()).isEqualTo(UPDATED_MAX_TEMPERATURE);
        assertThat(testWeather.getMinTemperature()).isEqualTo(UPDATED_MIN_TEMPERATURE);
        assertThat(testWeather.getPrecipitation()).isEqualTo(UPDATED_PRECIPITATION);
        assertThat(testWeather.getWindSpeed()).isEqualTo(UPDATED_WIND_SPEED);
        assertThat(testWeather.getWindDirection()).isEqualTo(UPDATED_WIND_DIRECTION);
    }

    @Test
    @Transactional
    void putNonExistingWeather() throws Exception {
        int databaseSizeBeforeUpdate = weatherRepository.findAll().size();
        weather.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeatherMockMvc
            .perform(
                put(ENTITY_API_URL_ID, weather.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(weather))
            )
            .andExpect(status().isBadRequest());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWeather() throws Exception {
        int databaseSizeBeforeUpdate = weatherRepository.findAll().size();
        weather.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeatherMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(weather))
            )
            .andExpect(status().isBadRequest());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWeather() throws Exception {
        int databaseSizeBeforeUpdate = weatherRepository.findAll().size();
        weather.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeatherMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(weather)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWeatherWithPatch() throws Exception {
        // Initialize the database
        weatherRepository.saveAndFlush(weather);

        int databaseSizeBeforeUpdate = weatherRepository.findAll().size();

        // Update the weather using partial update
        Weather partialUpdatedWeather = new Weather();
        partialUpdatedWeather.setId(weather.getId());

        partialUpdatedWeather
            .weatherCode(UPDATED_WEATHER_CODE)
            .maxTemperature(UPDATED_MAX_TEMPERATURE)
            .minTemperature(UPDATED_MIN_TEMPERATURE)
            .precipitation(UPDATED_PRECIPITATION)
            .windSpeed(UPDATED_WIND_SPEED);

        restWeatherMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWeather.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWeather))
            )
            .andExpect(status().isOk());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeUpdate);
        Weather testWeather = weatherList.get(weatherList.size() - 1);
        assertThat(testWeather.getDatetime()).isEqualTo(DEFAULT_DATETIME);
        assertThat(testWeather.getWeatherCode()).isEqualTo(UPDATED_WEATHER_CODE);
        assertThat(testWeather.getMaxTemperature()).isEqualTo(UPDATED_MAX_TEMPERATURE);
        assertThat(testWeather.getMinTemperature()).isEqualTo(UPDATED_MIN_TEMPERATURE);
        assertThat(testWeather.getPrecipitation()).isEqualTo(UPDATED_PRECIPITATION);
        assertThat(testWeather.getWindSpeed()).isEqualTo(UPDATED_WIND_SPEED);
        assertThat(testWeather.getWindDirection()).isEqualTo(DEFAULT_WIND_DIRECTION);
    }

    @Test
    @Transactional
    void fullUpdateWeatherWithPatch() throws Exception {
        // Initialize the database
        weatherRepository.saveAndFlush(weather);

        int databaseSizeBeforeUpdate = weatherRepository.findAll().size();

        // Update the weather using partial update
        Weather partialUpdatedWeather = new Weather();
        partialUpdatedWeather.setId(weather.getId());

        partialUpdatedWeather
            .datetime(UPDATED_DATETIME)
            .weatherCode(UPDATED_WEATHER_CODE)
            .maxTemperature(UPDATED_MAX_TEMPERATURE)
            .minTemperature(UPDATED_MIN_TEMPERATURE)
            .precipitation(UPDATED_PRECIPITATION)
            .windSpeed(UPDATED_WIND_SPEED)
            .windDirection(UPDATED_WIND_DIRECTION);

        restWeatherMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWeather.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWeather))
            )
            .andExpect(status().isOk());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeUpdate);
        Weather testWeather = weatherList.get(weatherList.size() - 1);
        assertThat(testWeather.getDatetime()).isEqualTo(UPDATED_DATETIME);
        assertThat(testWeather.getWeatherCode()).isEqualTo(UPDATED_WEATHER_CODE);
        assertThat(testWeather.getMaxTemperature()).isEqualTo(UPDATED_MAX_TEMPERATURE);
        assertThat(testWeather.getMinTemperature()).isEqualTo(UPDATED_MIN_TEMPERATURE);
        assertThat(testWeather.getPrecipitation()).isEqualTo(UPDATED_PRECIPITATION);
        assertThat(testWeather.getWindSpeed()).isEqualTo(UPDATED_WIND_SPEED);
        assertThat(testWeather.getWindDirection()).isEqualTo(UPDATED_WIND_DIRECTION);
    }

    @Test
    @Transactional
    void patchNonExistingWeather() throws Exception {
        int databaseSizeBeforeUpdate = weatherRepository.findAll().size();
        weather.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeatherMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, weather.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(weather))
            )
            .andExpect(status().isBadRequest());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWeather() throws Exception {
        int databaseSizeBeforeUpdate = weatherRepository.findAll().size();
        weather.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeatherMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(weather))
            )
            .andExpect(status().isBadRequest());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWeather() throws Exception {
        int databaseSizeBeforeUpdate = weatherRepository.findAll().size();
        weather.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeatherMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(weather)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Weather in the database
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWeather() throws Exception {
        // Initialize the database
        weatherRepository.saveAndFlush(weather);

        int databaseSizeBeforeDelete = weatherRepository.findAll().size();

        // Delete the weather
        restWeatherMockMvc
            .perform(delete(ENTITY_API_URL_ID, weather.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Weather> weatherList = weatherRepository.findAll();
        assertThat(weatherList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
