package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "location")
    private String location;

    @NotNull
    @Column(name = "date_time", nullable = false)
    private ZonedDateTime dateTime;

    @Column(name = "end_time")
    private ZonedDateTime endTime;

    @OneToMany(mappedBy = "event")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "event", "outfits", "owner" }, allowSetters = true)
    private Set<ClothingItem> clothingItems = new HashSet<>();

    @OneToMany(mappedBy = "event")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rating", "event", "creator", "clothingItems" }, allowSetters = true)
    private Set<Outfit> outfits = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Event id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Event title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return this.location;
    }

    public Event location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ZonedDateTime getDateTime() {
        return this.dateTime;
    }

    public Event dateTime(ZonedDateTime dateTime) {
        this.setDateTime(dateTime);
        return this;
    }

    public void setDateTime(ZonedDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public ZonedDateTime getEndTime() {
        return this.endTime;
    }

    public Event endTime(ZonedDateTime endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public Set<ClothingItem> getClothingItems() {
        return this.clothingItems;
    }

    public void setClothingItems(Set<ClothingItem> clothingItems) {
        if (this.clothingItems != null) {
            this.clothingItems.forEach(i -> i.setEvent(null));
        }
        if (clothingItems != null) {
            clothingItems.forEach(i -> i.setEvent(this));
        }
        this.clothingItems = clothingItems;
    }

    public Event clothingItems(Set<ClothingItem> clothingItems) {
        this.setClothingItems(clothingItems);
        return this;
    }

    public Event addClothingItem(ClothingItem clothingItem) {
        this.clothingItems.add(clothingItem);
        clothingItem.setEvent(this);
        return this;
    }

    public Event removeClothingItem(ClothingItem clothingItem) {
        this.clothingItems.remove(clothingItem);
        clothingItem.setEvent(null);
        return this;
    }

    public Set<Outfit> getOutfits() {
        return this.outfits;
    }

    public void setOutfits(Set<Outfit> outfits) {
        if (this.outfits != null) {
            this.outfits.forEach(i -> i.setEvent(null));
        }
        if (outfits != null) {
            outfits.forEach(i -> i.setEvent(this));
        }
        this.outfits = outfits;
    }

    public Event outfits(Set<Outfit> outfits) {
        this.setOutfits(outfits);
        return this;
    }

    public Event addOutfit(Outfit outfit) {
        this.outfits.add(outfit);
        outfit.setEvent(this);
        return this;
    }

    public Event removeOutfit(Outfit outfit) {
        this.outfits.remove(outfit);
        outfit.setEvent(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return id != null && id.equals(((Event) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", location='" + getLocation() + "'" +
            ", dateTime='" + getDateTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
