package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FashionTip.
 */
@Entity
@Table(name = "fashion_tip")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FashionTip implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title_1", nullable = false)
    private String title1;

    @Column(name = "description_1")
    private String description1;

    @Column(name = "title_2")
    private String title2;

    @Column(name = "description_2")
    private String description2;

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
    private UserProfile author;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FashionTip id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle1() {
        return this.title1;
    }

    public FashionTip title1(String title1) {
        this.setTitle1(title1);
        return this;
    }

    public void setTitle1(String title1) {
        this.title1 = title1;
    }

    public String getDescription1() {
        return this.description1;
    }

    public FashionTip description1(String description1) {
        this.setDescription1(description1);
        return this;
    }

    public void setDescription1(String description1) {
        this.description1 = description1;
    }

    public String getTitle2() {
        return this.title2;
    }

    public FashionTip title2(String title2) {
        this.setTitle2(title2);
        return this;
    }

    public void setTitle2(String title2) {
        this.title2 = title2;
    }

    public String getDescription2() {
        return this.description2;
    }

    public FashionTip description2(String description2) {
        this.setDescription2(description2);
        return this;
    }

    public void setDescription2(String description2) {
        this.description2 = description2;
    }

    public UserProfile getAuthor() {
        return this.author;
    }

    public void setAuthor(UserProfile userProfile) {
        this.author = userProfile;
    }

    public FashionTip author(UserProfile userProfile) {
        this.setAuthor(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FashionTip)) {
            return false;
        }
        return id != null && id.equals(((FashionTip) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FashionTip{" +
            "id=" + getId() +
            ", title1='" + getTitle1() + "'" +
            ", description1='" + getDescription1() + "'" +
            ", title2='" + getTitle2() + "'" +
            ", description2='" + getDescription2() + "'" +
            "}";
    }
}
