package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Post.
 */
@Entity
@Table(name = "post")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "caption", nullable = false)
    private String caption;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @Column(name = "edited_date")
    private LocalDate editedDate;

    @Column(name = "total_likes")
    private Integer totalLikes;

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

    @OneToMany(mappedBy = "post")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "post", "userLiked" }, allowSetters = true)
    private Set<Likes> likes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Post id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaption() {
        return this.caption;
    }

    public Post caption(String caption) {
        this.setCaption(caption);
        return this;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Post image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Post imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public Post createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getEditedDate() {
        return this.editedDate;
    }

    public Post editedDate(LocalDate editedDate) {
        this.setEditedDate(editedDate);
        return this;
    }

    public void setEditedDate(LocalDate editedDate) {
        this.editedDate = editedDate;
    }

    public Integer getTotalLikes() {
        return this.totalLikes;
    }

    public Post totalLikes(Integer totalLikes) {
        this.setTotalLikes(totalLikes);
        return this;
    }

    public void setTotalLikes(Integer totalLikes) {
        this.totalLikes = totalLikes;
    }

    public UserProfile getAuthor() {
        return this.author;
    }

    public void setAuthor(UserProfile userProfile) {
        this.author = userProfile;
    }

    public Post author(UserProfile userProfile) {
        this.setAuthor(userProfile);
        return this;
    }

    public Set<Likes> getLikes() {
        return this.likes;
    }

    public void setLikes(Set<Likes> likes) {
        if (this.likes != null) {
            this.likes.forEach(i -> i.setPost(null));
        }
        if (likes != null) {
            likes.forEach(i -> i.setPost(this));
        }
        this.likes = likes;
    }

    public Post likes(Set<Likes> likes) {
        this.setLikes(likes);
        return this;
    }

    public Post addLikes(Likes likes) {
        this.likes.add(likes);
        likes.setPost(this);
        return this;
    }

    public Post removeLikes(Likes likes) {
        this.likes.remove(likes);
        likes.setPost(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Post)) {
            return false;
        }
        return id != null && id.equals(((Post) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Post{" +
            "id=" + getId() +
            ", caption='" + getCaption() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", editedDate='" + getEditedDate() + "'" +
            ", totalLikes=" + getTotalLikes() +
            "}";
    }
}
