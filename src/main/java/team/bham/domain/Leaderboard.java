package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Leaderboard.
 */
@Entity
@Table(name = "leaderboard")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Leaderboard implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "profile_pic")
    private byte[] profilePic;

    @Column(name = "profile_pic_content_type")
    private String profilePicContentType;

    @Column(name = "users_name")
    private String usersName;

    @Column(name = "like_count")
    private Integer likeCount;

    @Column(name = "position")
    private Integer position;

    @ManyToOne
    @JsonIgnoreProperties(value = { "author", "likes" }, allowSetters = true)
    private Post post;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Leaderboard id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getProfilePic() {
        return this.profilePic;
    }

    public Leaderboard profilePic(byte[] profilePic) {
        this.setProfilePic(profilePic);
        return this;
    }

    public void setProfilePic(byte[] profilePic) {
        this.profilePic = profilePic;
    }

    public String getProfilePicContentType() {
        return this.profilePicContentType;
    }

    public Leaderboard profilePicContentType(String profilePicContentType) {
        this.profilePicContentType = profilePicContentType;
        return this;
    }

    public void setProfilePicContentType(String profilePicContentType) {
        this.profilePicContentType = profilePicContentType;
    }

    public String getUsersName() {
        return this.usersName;
    }

    public Leaderboard usersName(String usersName) {
        this.setUsersName(usersName);
        return this;
    }

    public void setUsersName(String usersName) {
        this.usersName = usersName;
    }

    public Integer getLikeCount() {
        return this.likeCount;
    }

    public Leaderboard likeCount(Integer likeCount) {
        this.setLikeCount(likeCount);
        return this;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Integer getPosition() {
        return this.position;
    }

    public Leaderboard position(Integer position) {
        this.setPosition(position);
        return this;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Post getPost() {
        return this.post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Leaderboard post(Post post) {
        this.setPost(post);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Leaderboard)) {
            return false;
        }
        return id != null && id.equals(((Leaderboard) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Leaderboard{" +
            "id=" + getId() +
            ", profilePic='" + getProfilePic() + "'" +
            ", profilePicContentType='" + getProfilePicContentType() + "'" +
            ", usersName='" + getUsersName() + "'" +
            ", likeCount=" + getLikeCount() +
            ", position=" + getPosition() +
            "}";
    }
}
