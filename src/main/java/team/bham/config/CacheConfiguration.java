package team.bham.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, team.bham.domain.User.class.getName());
            createCache(cm, team.bham.domain.Authority.class.getName());
            createCache(cm, team.bham.domain.User.class.getName() + ".authorities");
            createCache(cm, team.bham.domain.UserProfile.class.getName());
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".posts");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".comments");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".likes");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".clothingItems");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".outfits");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".messages");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".exchangeRequests");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".purchaseListings");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".saleListings");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".fashionTips");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".userMilestones");
            createCache(cm, team.bham.domain.UserProfile.class.getName() + ".chatrooms");
            createCache(cm, team.bham.domain.ClothingItem.class.getName());
            createCache(cm, team.bham.domain.ClothingItem.class.getName() + ".outfits");
            createCache(cm, team.bham.domain.Outfit.class.getName());
            createCache(cm, team.bham.domain.Outfit.class.getName() + ".clothingItems");
            createCache(cm, team.bham.domain.Message.class.getName());
            createCache(cm, team.bham.domain.Chatroom.class.getName());
            createCache(cm, team.bham.domain.Chatroom.class.getName() + ".chatrooms");
            createCache(cm, team.bham.domain.Chatroom.class.getName() + ".userProfiles");
            createCache(cm, team.bham.domain.UserMilestone.class.getName());
            createCache(cm, team.bham.domain.MilestoneType.class.getName());
            createCache(cm, team.bham.domain.MilestoneType.class.getName() + ".types");
            createCache(cm, team.bham.domain.Event.class.getName());
            createCache(cm, team.bham.domain.Event.class.getName() + ".events");
            createCache(cm, team.bham.domain.Calendar.class.getName());
            createCache(cm, team.bham.domain.Calendar.class.getName() + ".weathers");
            createCache(cm, team.bham.domain.Weather.class.getName());
            createCache(cm, team.bham.domain.Weather.class.getName() + ".weathers");
            createCache(cm, team.bham.domain.FashionTip.class.getName());
            createCache(cm, team.bham.domain.ExchangeRequest.class.getName());
            createCache(cm, team.bham.domain.PurchaseListing.class.getName());
            createCache(cm, team.bham.domain.SaleListing.class.getName());
            createCache(cm, team.bham.domain.Rating.class.getName());
            createCache(cm, team.bham.domain.Rating.class.getName() + ".ratings");
            createCache(cm, team.bham.domain.TrendingOutfit.class.getName());
            createCache(cm, team.bham.domain.Post.class.getName());
            createCache(cm, team.bham.domain.Post.class.getName() + ".likes");
            createCache(cm, team.bham.domain.Likes.class.getName());
            createCache(cm, team.bham.domain.Comment.class.getName());
            createCache(cm, team.bham.domain.Leaderboard.class.getName());
            createCache(cm, team.bham.domain.ClothingPic.class.getName());
            createCache(cm, team.bham.domain.OutfitPic.class.getName());
            createCache(cm, team.bham.domain.Event.class.getName() + ".clothingItems");
            createCache(cm, team.bham.domain.Event.class.getName() + ".outfits");
            createCache(cm, team.bham.domain.Outfit.class.getName() + ".weathers");
            createCache(cm, team.bham.domain.Outfit.class.getName() + ".ratings");
            createCache(cm, team.bham.domain.Chatroom.class.getName() + ".chatMessages");
            createCache(cm, team.bham.domain.ChatMessage.class.getName());
            createCache(cm, team.bham.domain.ItemLog.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
