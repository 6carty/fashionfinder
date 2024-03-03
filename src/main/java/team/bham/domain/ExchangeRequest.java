package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ExchangeRequest.
 */
@Entity
@Table(name = "exchange_request")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExchangeRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "offering_item", nullable = false)
    private Long offeringItem;

    @NotNull
    @Column(name = "requested_item", nullable = false)
    private Long requestedItem;

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
    private UserProfile requester;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ExchangeRequest id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOfferingItem() {
        return this.offeringItem;
    }

    public ExchangeRequest offeringItem(Long offeringItem) {
        this.setOfferingItem(offeringItem);
        return this;
    }

    public void setOfferingItem(Long offeringItem) {
        this.offeringItem = offeringItem;
    }

    public Long getRequestedItem() {
        return this.requestedItem;
    }

    public ExchangeRequest requestedItem(Long requestedItem) {
        this.setRequestedItem(requestedItem);
        return this;
    }

    public void setRequestedItem(Long requestedItem) {
        this.requestedItem = requestedItem;
    }

    public UserProfile getRequester() {
        return this.requester;
    }

    public void setRequester(UserProfile userProfile) {
        this.requester = userProfile;
    }

    public ExchangeRequest requester(UserProfile userProfile) {
        this.setRequester(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExchangeRequest)) {
            return false;
        }
        return id != null && id.equals(((ExchangeRequest) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExchangeRequest{" +
            "id=" + getId() +
            ", offeringItem=" + getOfferingItem() +
            ", requestedItem=" + getRequestedItem() +
            "}";
    }
}
