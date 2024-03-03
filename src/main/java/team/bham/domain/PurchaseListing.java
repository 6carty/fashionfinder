package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PurchaseListing.
 */
@Entity
@Table(name = "purchase_listing")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PurchaseListing implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "item_for_sale", nullable = false)
    private Long itemForSale;

    @NotNull
    @Column(name = "price", nullable = false)
    private Double price;

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
    private UserProfile seller;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PurchaseListing id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemForSale() {
        return this.itemForSale;
    }

    public PurchaseListing itemForSale(Long itemForSale) {
        this.setItemForSale(itemForSale);
        return this;
    }

    public void setItemForSale(Long itemForSale) {
        this.itemForSale = itemForSale;
    }

    public Double getPrice() {
        return this.price;
    }

    public PurchaseListing price(Double price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public UserProfile getSeller() {
        return this.seller;
    }

    public void setSeller(UserProfile userProfile) {
        this.seller = userProfile;
    }

    public PurchaseListing seller(UserProfile userProfile) {
        this.setSeller(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PurchaseListing)) {
            return false;
        }
        return id != null && id.equals(((PurchaseListing) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PurchaseListing{" +
            "id=" + getId() +
            ", itemForSale=" + getItemForSale() +
            ", price=" + getPrice() +
            "}";
    }
}
