package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Rating.
 */
@Entity
@Table(name = "rating")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Rating implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "rated_at", nullable = false)
    private Instant ratedAt;

    @ManyToOne
    private User userRated;

    @ManyToOne
    @JsonIgnoreProperties(value = { "ratings", "userCreated", "creator", "clothingItems" }, allowSetters = true)
    private Outfit outfit;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Rating id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getRatedAt() {
        return this.ratedAt;
    }

    public Rating ratedAt(Instant ratedAt) {
        this.setRatedAt(ratedAt);
        return this;
    }

    public void setRatedAt(Instant ratedAt) {
        this.ratedAt = ratedAt;
    }

    public User getUserRated() {
        return this.userRated;
    }

    public void setUserRated(User user) {
        this.userRated = user;
    }

    public Rating userRated(User user) {
        this.setUserRated(user);
        return this;
    }

    public Outfit getOutfit() {
        return this.outfit;
    }

    public void setOutfit(Outfit outfit) {
        this.outfit = outfit;
    }

    public Rating outfit(Outfit outfit) {
        this.setOutfit(outfit);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rating)) {
            return false;
        }
        return id != null && id.equals(((Rating) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Rating{" +
            "id=" + getId() +
            ", ratedAt='" + getRatedAt() + "'" +
            "}";
    }
}
