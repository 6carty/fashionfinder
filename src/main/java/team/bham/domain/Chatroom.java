package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Chatroom.
 */
@Entity
@Table(name = "chatroom")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Chatroom implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "icon")
    private byte[] icon;

    @Column(name = "icon_content_type")
    private String iconContentType;

    @OneToMany(mappedBy = "chatroom")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chatroom", "userProfile" }, allowSetters = true)
    private Set<Message> chatrooms = new HashSet<>();

    @ManyToMany(mappedBy = "chatrooms")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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
    private Set<UserProfile> userProfiles = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Chatroom id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Chatroom name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getIcon() {
        return this.icon;
    }

    public Chatroom icon(byte[] icon) {
        this.setIcon(icon);
        return this;
    }

    public void setIcon(byte[] icon) {
        this.icon = icon;
    }

    public String getIconContentType() {
        return this.iconContentType;
    }

    public Chatroom iconContentType(String iconContentType) {
        this.iconContentType = iconContentType;
        return this;
    }

    public void setIconContentType(String iconContentType) {
        this.iconContentType = iconContentType;
    }

    public Set<Message> getChatrooms() {
        return this.chatrooms;
    }

    public void setChatrooms(Set<Message> messages) {
        if (this.chatrooms != null) {
            this.chatrooms.forEach(i -> i.setChatroom(null));
        }
        if (messages != null) {
            messages.forEach(i -> i.setChatroom(this));
        }
        this.chatrooms = messages;
    }

    public Chatroom chatrooms(Set<Message> messages) {
        this.setChatrooms(messages);
        return this;
    }

    public Chatroom addChatroom(Message message) {
        this.chatrooms.add(message);
        message.setChatroom(this);
        return this;
    }

    public Chatroom removeChatroom(Message message) {
        this.chatrooms.remove(message);
        message.setChatroom(null);
        return this;
    }

    public Set<UserProfile> getUserProfiles() {
        return this.userProfiles;
    }

    public void setUserProfiles(Set<UserProfile> userProfiles) {
        if (this.userProfiles != null) {
            this.userProfiles.forEach(i -> i.removeChatroom(this));
        }
        if (userProfiles != null) {
            userProfiles.forEach(i -> i.addChatroom(this));
        }
        this.userProfiles = userProfiles;
    }

    public Chatroom userProfiles(Set<UserProfile> userProfiles) {
        this.setUserProfiles(userProfiles);
        return this;
    }

    public Chatroom addUserProfile(UserProfile userProfile) {
        this.userProfiles.add(userProfile);
        userProfile.getChatrooms().add(this);
        return this;
    }

    public Chatroom removeUserProfile(UserProfile userProfile) {
        this.userProfiles.remove(userProfile);
        userProfile.getChatrooms().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chatroom)) {
            return false;
        }
        return id != null && id.equals(((Chatroom) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Chatroom{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", icon='" + getIcon() + "'" +
            ", iconContentType='" + getIconContentType() + "'" +
            "}";
    }
}
