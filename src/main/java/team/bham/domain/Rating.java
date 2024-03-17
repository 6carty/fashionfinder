package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
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
    @Column(name = "rating", nullable = false)
    private Double rating;

    @JsonIgnoreProperties(value = { "rating" }, allowSetters = true)
    @OneToOne(mappedBy = "rating")
    private TrendingOutfit trendingOutfit;

    @JsonIgnoreProperties(value = { "rating", "event", "creator", "clothingItems" }, allowSetters = true)
    @OneToOne(mappedBy = "rating")
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

    public Double getRating() {
        return this.rating;
    }

    public Rating rating(Double rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public TrendingOutfit getTrendingOutfit() {
        return this.trendingOutfit;
    }

    public void setTrendingOutfit(TrendingOutfit trendingOutfit) {
        if (this.trendingOutfit != null) {
            this.trendingOutfit.setRating(null);
        }
        if (trendingOutfit != null) {
            trendingOutfit.setRating(this);
        }
        this.trendingOutfit = trendingOutfit;
    }

    public Rating trendingOutfit(TrendingOutfit trendingOutfit) {
        this.setTrendingOutfit(trendingOutfit);
        return this;
    }

    public Outfit getOutfit() {
        return this.outfit;
    }

    public void setOutfit(Outfit outfit) {
        if (this.outfit != null) {
            this.outfit.setRating(null);
        }
        if (outfit != null) {
            outfit.setRating(this);
        }
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
            ", rating=" + getRating() +
            "}";
    }
}
