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
import team.bham.domain.enumeration.ClothingType;
import team.bham.domain.enumeration.Status;

/**
 * A ClothingItem.
 */
@Entity
@Table(name = "clothing_item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ClothingItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ClothingType type;

    @Column(name = "description")
    private String description;

    @Column(name = "clothing_size")
    private String clothingSize;

    @Column(name = "colour")
    private String colour;

    @Column(name = "style")
    private String style;

    @Column(name = "brand")
    private String brand;

    @Column(name = "material")
    private String material;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "last_worn")
    private Instant lastWorn;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @ManyToMany
    @JoinTable(
        name = "rel_clothing_item__outfit",
        joinColumns = @JoinColumn(name = "clothing_item_id"),
        inverseJoinColumns = @JoinColumn(name = "outfit_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ratings", "creator", "clothingItems" }, allowSetters = true)
    private Set<Outfit> outfits = new HashSet<>();

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
    private UserProfile owner;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ClothingItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ClothingItem name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ClothingType getType() {
        return this.type;
    }

    public ClothingItem type(ClothingType type) {
        this.setType(type);
        return this;
    }

    public void setType(ClothingType type) {
        this.type = type;
    }

    public String getDescription() {
        return this.description;
    }

    public ClothingItem description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getClothingSize() {
        return this.clothingSize;
    }

    public ClothingItem clothingSize(String clothingSize) {
        this.setClothingSize(clothingSize);
        return this;
    }

    public void setClothingSize(String clothingSize) {
        this.clothingSize = clothingSize;
    }

    public String getColour() {
        return this.colour;
    }

    public ClothingItem colour(String colour) {
        this.setColour(colour);
        return this;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public String getStyle() {
        return this.style;
    }

    public ClothingItem style(String style) {
        this.setStyle(style);
        return this;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getBrand() {
        return this.brand;
    }

    public ClothingItem brand(String brand) {
        this.setBrand(brand);
        return this;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getMaterial() {
        return this.material;
    }

    public ClothingItem material(String material) {
        this.setMaterial(material);
        return this;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Status getStatus() {
        return this.status;
    }

    public ClothingItem status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Instant getLastWorn() {
        return this.lastWorn;
    }

    public ClothingItem lastWorn(Instant lastWorn) {
        this.setLastWorn(lastWorn);
        return this;
    }

    public void setLastWorn(Instant lastWorn) {
        this.lastWorn = lastWorn;
    }

    public byte[] getImage() {
        return this.image;
    }

    public ClothingItem image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public ClothingItem imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Set<Outfit> getOutfits() {
        return this.outfits;
    }

    public void setOutfits(Set<Outfit> outfits) {
        this.outfits = outfits;
    }

    public ClothingItem outfits(Set<Outfit> outfits) {
        this.setOutfits(outfits);
        return this;
    }

    public ClothingItem addOutfit(Outfit outfit) {
        this.outfits.add(outfit);
        outfit.getClothingItems().add(this);
        return this;
    }

    public ClothingItem removeOutfit(Outfit outfit) {
        this.outfits.remove(outfit);
        outfit.getClothingItems().remove(this);
        return this;
    }

    public UserProfile getOwner() {
        return this.owner;
    }

    public void setOwner(UserProfile userProfile) {
        this.owner = userProfile;
    }

    public ClothingItem owner(UserProfile userProfile) {
        this.setOwner(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClothingItem)) {
            return false;
        }
        return id != null && id.equals(((ClothingItem) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClothingItem{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", description='" + getDescription() + "'" +
            ", clothingSize='" + getClothingSize() + "'" +
            ", colour='" + getColour() + "'" +
            ", style='" + getStyle() + "'" +
            ", brand='" + getBrand() + "'" +
            ", material='" + getMaterial() + "'" +
            ", status='" + getStatus() + "'" +
            ", lastWorn='" + getLastWorn() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
