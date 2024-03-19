package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Weather.
 */
@Entity
@Table(name = "weather")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Weather implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "datetime", nullable = false)
    private ZonedDateTime datetime;

    @NotNull
    @Column(name = "weather_code", nullable = false)
    private String weatherCode;

    @Column(name = "max_temperature")
    private Double maxTemperature;

    @Column(name = "min_temperature")
    private Double minTemperature;

    @Column(name = "precipitation")
    private Double precipitation;

    @Column(name = "wind_speed")
    private Double windSpeed;

    @Column(name = "wind_direction")
    private String windDirection;

    @ManyToOne
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private Calendar calendar;

    @ManyToOne
    @JsonIgnoreProperties(value = { "ratings", "creator", "clothingItems" }, allowSetters = true)
    private Outfit weather;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Weather id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDatetime() {
        return this.datetime;
    }

    public Weather datetime(ZonedDateTime datetime) {
        this.setDatetime(datetime);
        return this;
    }

    public void setDatetime(ZonedDateTime datetime) {
        this.datetime = datetime;
    }

    public String getWeatherCode() {
        return this.weatherCode;
    }

    public Weather weatherCode(String weatherCode) {
        this.setWeatherCode(weatherCode);
        return this;
    }

    public void setWeatherCode(String weatherCode) {
        this.weatherCode = weatherCode;
    }

    public Double getMaxTemperature() {
        return this.maxTemperature;
    }

    public Weather maxTemperature(Double maxTemperature) {
        this.setMaxTemperature(maxTemperature);
        return this;
    }

    public void setMaxTemperature(Double maxTemperature) {
        this.maxTemperature = maxTemperature;
    }

    public Double getMinTemperature() {
        return this.minTemperature;
    }

    public Weather minTemperature(Double minTemperature) {
        this.setMinTemperature(minTemperature);
        return this;
    }

    public void setMinTemperature(Double minTemperature) {
        this.minTemperature = minTemperature;
    }

    public Double getPrecipitation() {
        return this.precipitation;
    }

    public Weather precipitation(Double precipitation) {
        this.setPrecipitation(precipitation);
        return this;
    }

    public void setPrecipitation(Double precipitation) {
        this.precipitation = precipitation;
    }

    public Double getWindSpeed() {
        return this.windSpeed;
    }

    public Weather windSpeed(Double windSpeed) {
        this.setWindSpeed(windSpeed);
        return this;
    }

    public void setWindSpeed(Double windSpeed) {
        this.windSpeed = windSpeed;
    }

    public String getWindDirection() {
        return this.windDirection;
    }

    public Weather windDirection(String windDirection) {
        this.setWindDirection(windDirection);
        return this;
    }

    public void setWindDirection(String windDirection) {
        this.windDirection = windDirection;
    }

    public Calendar getCalendar() {
        return this.calendar;
    }

    public void setCalendar(Calendar calendar) {
        this.calendar = calendar;
    }

    public Weather calendar(Calendar calendar) {
        this.setCalendar(calendar);
        return this;
    }

    public Outfit getWeather() {
        return this.weather;
    }

    public void setWeather(Outfit outfit) {
        this.weather = outfit;
    }

    public Weather weather(Outfit outfit) {
        this.setWeather(outfit);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Weather)) {
            return false;
        }
        return id != null && id.equals(((Weather) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Weather{" +
            "id=" + getId() +
            ", datetime='" + getDatetime() + "'" +
            ", weatherCode='" + getWeatherCode() + "'" +
            ", maxTemperature=" + getMaxTemperature() +
            ", minTemperature=" + getMinTemperature() +
            ", precipitation=" + getPrecipitation() +
            ", windSpeed=" + getWindSpeed() +
            ", windDirection='" + getWindDirection() + "'" +
            "}";
    }
}
