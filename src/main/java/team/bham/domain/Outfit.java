package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Occasion;

/**
 * A Outfit.
 */
@Entity
@Table(name = "outfit")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Outfit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "date")
    private Instant date;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "occasion", nullable = false)
    private Occasion occasion;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @OneToMany(mappedBy = "outfit")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userRated", "outfit" }, allowSetters = true)
    private Set<Rating> ratings = new HashSet<>();

    @ManyToOne
    private User userCreated;

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
            "purchaseListings",
            "saleListings",
            "fashionTips",
            "userMilestones",
            "events",
            "chatrooms",
            "calendar",
        },
        allowSetters = true
    )
    private UserProfile creator;

    @ManyToMany(mappedBy = "outfits")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "outfits", "owner" }, allowSetters = true)
    private Set<ClothingItem> clothingItems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Outfit id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Outfit name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Outfit description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDate() {
        return this.date;
    }

    public Outfit date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Occasion getOccasion() {
        return this.occasion;
    }

    public Outfit occasion(Occasion occasion) {
        this.setOccasion(occasion);
        return this;
    }

    public void setOccasion(Occasion occasion) {
        this.occasion = occasion;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Outfit image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Outfit imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Set<Rating> getRatings() {
        return this.ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        if (this.ratings != null) {
            this.ratings.forEach(i -> i.setOutfit(null));
        }
        if (ratings != null) {
            ratings.forEach(i -> i.setOutfit(this));
        }
        this.ratings = ratings;
    }

    public Outfit ratings(Set<Rating> ratings) {
        this.setRatings(ratings);
        return this;
    }

    public Outfit addRatings(Rating rating) {
        this.ratings.add(rating);
        rating.setOutfit(this);
        return this;
    }

    public Outfit removeRatings(Rating rating) {
        this.ratings.remove(rating);
        rating.setOutfit(null);
        return this;
    }

    public User getUserCreated() {
        return this.userCreated;
    }

    public void setUserCreated(User user) {
        this.userCreated = user;
    }

    public Outfit userCreated(User user) {
        this.setUserCreated(user);
        return this;
    }

    public UserProfile getCreator() {
        return this.creator;
    }

    public void setCreator(UserProfile userProfile) {
        this.creator = userProfile;
    }

    public Outfit creator(UserProfile userProfile) {
        this.setCreator(userProfile);
        return this;
    }

    public Set<ClothingItem> getClothingItems() {
        return this.clothingItems;
    }

    public void setClothingItems(Set<ClothingItem> clothingItems) {
        if (this.clothingItems != null) {
            this.clothingItems.forEach(i -> i.removeOutfit(this));
        }
        if (clothingItems != null) {
            clothingItems.forEach(i -> i.addOutfit(this));
        }
        this.clothingItems = clothingItems;
    }

    public Outfit clothingItems(Set<ClothingItem> clothingItems) {
        this.setClothingItems(clothingItems);
        return this;
    }

    public Outfit addClothingItem(ClothingItem clothingItem) {
        this.clothingItems.add(clothingItem);
        clothingItem.getOutfits().add(this);
        return this;
    }

    public Outfit removeClothingItem(ClothingItem clothingItem) {
        this.clothingItems.remove(clothingItem);
        clothingItem.getOutfits().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Outfit)) {
            return false;
        }
        return id != null && id.equals(((Outfit) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Outfit{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", occasion='" + getOccasion() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
