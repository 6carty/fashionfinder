package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserMilestone.
 */
@Entity
@Table(name = "user_milestone")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserMilestone implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "current_progress", nullable = false)
    private Long currentProgress;

    @NotNull
    @Column(name = "completed", nullable = false)
    private Boolean completed;

    @Column(name = "unlocked_date")
    private Instant unlockedDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "types" }, allowSetters = true)
    private MilestoneType milestoneType;

    @ManyToOne
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
    private UserProfile userProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserMilestone id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCurrentProgress() {
        return this.currentProgress;
    }

    public UserMilestone currentProgress(Long currentProgress) {
        this.setCurrentProgress(currentProgress);
        return this;
    }

    public void setCurrentProgress(Long currentProgress) {
        this.currentProgress = currentProgress;
    }

    public Boolean getCompleted() {
        return this.completed;
    }

    public UserMilestone completed(Boolean completed) {
        this.setCompleted(completed);
        return this;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Instant getUnlockedDate() {
        return this.unlockedDate;
    }

    public UserMilestone unlockedDate(Instant unlockedDate) {
        this.setUnlockedDate(unlockedDate);
        return this;
    }

    public void setUnlockedDate(Instant unlockedDate) {
        this.unlockedDate = unlockedDate;
    }

    public MilestoneType getMilestoneType() {
        return this.milestoneType;
    }

    public void setMilestoneType(MilestoneType milestoneType) {
        this.milestoneType = milestoneType;
    }

    public UserMilestone milestoneType(MilestoneType milestoneType) {
        this.setMilestoneType(milestoneType);
        return this;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public UserMilestone userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserMilestone)) {
            return false;
        }
        return id != null && id.equals(((UserMilestone) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserMilestone{" +
            "id=" + getId() +
            ", currentProgress=" + getCurrentProgress() +
            ", completed='" + getCompleted() + "'" +
            ", unlockedDate='" + getUnlockedDate() + "'" +
            "}";
    }
}
