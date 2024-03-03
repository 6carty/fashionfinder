package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Likes.
 */
@Entity
@Table(name = "likes")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Likes implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "jhi_like")
    private Boolean like;

    @Column(name = "liked_at")
    private Instant likedAt;

    @ManyToOne
    @JsonIgnoreProperties(value = { "author", "likes" }, allowSetters = true)
    private Post post;

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
    private UserProfile userLiked;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Likes id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getLike() {
        return this.like;
    }

    public Likes like(Boolean like) {
        this.setLike(like);
        return this;
    }

    public void setLike(Boolean like) {
        this.like = like;
    }

    public Instant getLikedAt() {
        return this.likedAt;
    }

    public Likes likedAt(Instant likedAt) {
        this.setLikedAt(likedAt);
        return this;
    }

    public void setLikedAt(Instant likedAt) {
        this.likedAt = likedAt;
    }

    public Post getPost() {
        return this.post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Likes post(Post post) {
        this.setPost(post);
        return this;
    }

    public UserProfile getUserLiked() {
        return this.userLiked;
    }

    public void setUserLiked(UserProfile userProfile) {
        this.userLiked = userProfile;
    }

    public Likes userLiked(UserProfile userProfile) {
        this.setUserLiked(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Likes)) {
            return false;
        }
        return id != null && id.equals(((Likes) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Likes{" +
            "id=" + getId() +
            ", like='" + getLike() + "'" +
            ", likedAt='" + getLikedAt() + "'" +
            "}";
    }
}
