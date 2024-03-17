package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Calendar.
 */
@Entity
@Table(name = "calendar")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Calendar implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "current_week", nullable = false)
    private ZonedDateTime currentWeek;

    @Column(name = "calendar_connected")
    private String calendarConnected;

    @Column(name = "calendar_sync")
    private ZonedDateTime calendarSync;

    @JsonIgnoreProperties(
        value = {
            "user",
            "posts",
            "comments",
            "likes",
            "clothingItems",
            "outfits",
            "messages",
            "exchangeRequests",
            "purchaseListings",
            "saleListings",
            "fashionTips",
            "userMilestones",
            "chatrooms",
            "calendar",
        },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private UserProfile userProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Calendar id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getCurrentWeek() {
        return this.currentWeek;
    }

    public Calendar currentWeek(ZonedDateTime currentWeek) {
        this.setCurrentWeek(currentWeek);
        return this;
    }

    public void setCurrentWeek(ZonedDateTime currentWeek) {
        this.currentWeek = currentWeek;
    }

    public String getCalendarConnected() {
        return this.calendarConnected;
    }

    public Calendar calendarConnected(String calendarConnected) {
        this.setCalendarConnected(calendarConnected);
        return this;
    }

    public void setCalendarConnected(String calendarConnected) {
        this.calendarConnected = calendarConnected;
    }

    public ZonedDateTime getCalendarSync() {
        return this.calendarSync;
    }

    public Calendar calendarSync(ZonedDateTime calendarSync) {
        this.setCalendarSync(calendarSync);
        return this;
    }

    public void setCalendarSync(ZonedDateTime calendarSync) {
        this.calendarSync = calendarSync;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public Calendar userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Calendar)) {
            return false;
        }
        return id != null && id.equals(((Calendar) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Calendar{" +
            "id=" + getId() +
            ", currentWeek='" + getCurrentWeek() + "'" +
            ", calendarConnected='" + getCalendarConnected() + "'" +
            ", calendarSync='" + getCalendarSync() + "'" +
            "}";
    }
}
