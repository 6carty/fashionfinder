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
import team.bham.domain.enumeration.Privacy;

/**
 * A UserProfile.
 */
@Entity
@Table(name = "user_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Lob
    @Column(name = "profile_picture")
    private byte[] profilePicture;

    @Column(name = "profile_picture_content_type")
    private String profilePictureContentType;

    @Column(name = "last_seen")
    private Instant lastSeen;

    @Column(name = "location")
    private String location;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "privacy", nullable = false)
    private Privacy privacy;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "author")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "author", "likes" }, allowSetters = true)
    private Set<Post> posts = new HashSet<>();

    @OneToMany(mappedBy = "userCommented")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "postCommented", "userCommented" }, allowSetters = true)
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "userLiked")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "post", "userLiked" }, allowSetters = true)
    private Set<Likes> likes = new HashSet<>();

    @OneToMany(mappedBy = "owner")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "outfits", "owner" }, allowSetters = true)
    private Set<ClothingItem> clothingItems = new HashSet<>();

    @OneToMany(mappedBy = "creator")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ratings", "userCreated", "creator", "clothingItems" }, allowSetters = true)
    private Set<Outfit> outfits = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chatroom", "userProfile" }, allowSetters = true)
    private Set<Message> messages = new HashSet<>();

    @OneToMany(mappedBy = "seller")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "seller" }, allowSetters = true)
    private Set<PurchaseListing> purchaseListings = new HashSet<>();

    @OneToMany(mappedBy = "seller")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "seller" }, allowSetters = true)
    private Set<SaleListing> saleListings = new HashSet<>();

    @OneToMany(mappedBy = "author")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "author" }, allowSetters = true)
    private Set<FashionTip> fashionTips = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "milestoneType", "userProfile" }, allowSetters = true)
    private Set<UserMilestone> userMilestones = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_user_profile__chatroom",
        joinColumns = @JoinColumn(name = "user_profile_id"),
        inverseJoinColumns = @JoinColumn(name = "chatroom_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chatrooms", "userProfiles" }, allowSetters = true)
    private Set<Chatroom> chatrooms = new HashSet<>();

    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    @OneToOne(mappedBy = "userProfile")
    private Calendar calendar;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public UserProfile firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public UserProfile lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public byte[] getProfilePicture() {
        return this.profilePicture;
    }

    public UserProfile profilePicture(byte[] profilePicture) {
        this.setProfilePicture(profilePicture);
        return this;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getProfilePictureContentType() {
        return this.profilePictureContentType;
    }

    public UserProfile profilePictureContentType(String profilePictureContentType) {
        this.profilePictureContentType = profilePictureContentType;
        return this;
    }

    public void setProfilePictureContentType(String profilePictureContentType) {
        this.profilePictureContentType = profilePictureContentType;
    }

    public Instant getLastSeen() {
        return this.lastSeen;
    }

    public UserProfile lastSeen(Instant lastSeen) {
        this.setLastSeen(lastSeen);
        return this;
    }

    public void setLastSeen(Instant lastSeen) {
        this.lastSeen = lastSeen;
    }

    public String getLocation() {
        return this.location;
    }

    public UserProfile location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Privacy getPrivacy() {
        return this.privacy;
    }

    public UserProfile privacy(Privacy privacy) {
        this.setPrivacy(privacy);
        return this;
    }

    public void setPrivacy(Privacy privacy) {
        this.privacy = privacy;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserProfile user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Post> getPosts() {
        return this.posts;
    }

    public void setPosts(Set<Post> posts) {
        if (this.posts != null) {
            this.posts.forEach(i -> i.setAuthor(null));
        }
        if (posts != null) {
            posts.forEach(i -> i.setAuthor(this));
        }
        this.posts = posts;
    }

    public UserProfile posts(Set<Post> posts) {
        this.setPosts(posts);
        return this;
    }

    public UserProfile addPosts(Post post) {
        this.posts.add(post);
        post.setAuthor(this);
        return this;
    }

    public UserProfile removePosts(Post post) {
        this.posts.remove(post);
        post.setAuthor(null);
        return this;
    }

    public Set<Comment> getComments() {
        return this.comments;
    }

    public void setComments(Set<Comment> comments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setUserCommented(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setUserCommented(this));
        }
        this.comments = comments;
    }

    public UserProfile comments(Set<Comment> comments) {
        this.setComments(comments);
        return this;
    }

    public UserProfile addComments(Comment comment) {
        this.comments.add(comment);
        comment.setUserCommented(this);
        return this;
    }

    public UserProfile removeComments(Comment comment) {
        this.comments.remove(comment);
        comment.setUserCommented(null);
        return this;
    }

    public Set<Likes> getLikes() {
        return this.likes;
    }

    public void setLikes(Set<Likes> likes) {
        if (this.likes != null) {
            this.likes.forEach(i -> i.setUserLiked(null));
        }
        if (likes != null) {
            likes.forEach(i -> i.setUserLiked(this));
        }
        this.likes = likes;
    }

    public UserProfile likes(Set<Likes> likes) {
        this.setLikes(likes);
        return this;
    }

    public UserProfile addLikes(Likes likes) {
        this.likes.add(likes);
        likes.setUserLiked(this);
        return this;
    }

    public UserProfile removeLikes(Likes likes) {
        this.likes.remove(likes);
        likes.setUserLiked(null);
        return this;
    }

    public Set<ClothingItem> getClothingItems() {
        return this.clothingItems;
    }

    public void setClothingItems(Set<ClothingItem> clothingItems) {
        if (this.clothingItems != null) {
            this.clothingItems.forEach(i -> i.setOwner(null));
        }
        if (clothingItems != null) {
            clothingItems.forEach(i -> i.setOwner(this));
        }
        this.clothingItems = clothingItems;
    }

    public UserProfile clothingItems(Set<ClothingItem> clothingItems) {
        this.setClothingItems(clothingItems);
        return this;
    }

    public UserProfile addClothingItems(ClothingItem clothingItem) {
        this.clothingItems.add(clothingItem);
        clothingItem.setOwner(this);
        return this;
    }

    public UserProfile removeClothingItems(ClothingItem clothingItem) {
        this.clothingItems.remove(clothingItem);
        clothingItem.setOwner(null);
        return this;
    }

    public Set<Outfit> getOutfits() {
        return this.outfits;
    }

    public void setOutfits(Set<Outfit> outfits) {
        if (this.outfits != null) {
            this.outfits.forEach(i -> i.setCreator(null));
        }
        if (outfits != null) {
            outfits.forEach(i -> i.setCreator(this));
        }
        this.outfits = outfits;
    }

    public UserProfile outfits(Set<Outfit> outfits) {
        this.setOutfits(outfits);
        return this;
    }

    public UserProfile addOutfits(Outfit outfit) {
        this.outfits.add(outfit);
        outfit.setCreator(this);
        return this;
    }

    public UserProfile removeOutfits(Outfit outfit) {
        this.outfits.remove(outfit);
        outfit.setCreator(null);
        return this;
    }

    public Set<Message> getMessages() {
        return this.messages;
    }

    public void setMessages(Set<Message> messages) {
        if (this.messages != null) {
            this.messages.forEach(i -> i.setUserProfile(null));
        }
        if (messages != null) {
            messages.forEach(i -> i.setUserProfile(this));
        }
        this.messages = messages;
    }

    public UserProfile messages(Set<Message> messages) {
        this.setMessages(messages);
        return this;
    }

    public UserProfile addMessage(Message message) {
        this.messages.add(message);
        message.setUserProfile(this);
        return this;
    }

    public UserProfile removeMessage(Message message) {
        this.messages.remove(message);
        message.setUserProfile(null);
        return this;
    }

    public Set<PurchaseListing> getPurchaseListings() {
        return this.purchaseListings;
    }

    public void setPurchaseListings(Set<PurchaseListing> purchaseListings) {
        if (this.purchaseListings != null) {
            this.purchaseListings.forEach(i -> i.setSeller(null));
        }
        if (purchaseListings != null) {
            purchaseListings.forEach(i -> i.setSeller(this));
        }
        this.purchaseListings = purchaseListings;
    }

    public UserProfile purchaseListings(Set<PurchaseListing> purchaseListings) {
        this.setPurchaseListings(purchaseListings);
        return this;
    }

    public UserProfile addPurchaseListings(PurchaseListing purchaseListing) {
        this.purchaseListings.add(purchaseListing);
        purchaseListing.setSeller(this);
        return this;
    }

    public UserProfile removePurchaseListings(PurchaseListing purchaseListing) {
        this.purchaseListings.remove(purchaseListing);
        purchaseListing.setSeller(null);
        return this;
    }

    public Set<SaleListing> getSaleListings() {
        return this.saleListings;
    }

    public void setSaleListings(Set<SaleListing> saleListings) {
        if (this.saleListings != null) {
            this.saleListings.forEach(i -> i.setSeller(null));
        }
        if (saleListings != null) {
            saleListings.forEach(i -> i.setSeller(this));
        }
        this.saleListings = saleListings;
    }

    public UserProfile saleListings(Set<SaleListing> saleListings) {
        this.setSaleListings(saleListings);
        return this;
    }

    public UserProfile addSaleListings(SaleListing saleListing) {
        this.saleListings.add(saleListing);
        saleListing.setSeller(this);
        return this;
    }

    public UserProfile removeSaleListings(SaleListing saleListing) {
        this.saleListings.remove(saleListing);
        saleListing.setSeller(null);
        return this;
    }

    public Set<FashionTip> getFashionTips() {
        return this.fashionTips;
    }

    public void setFashionTips(Set<FashionTip> fashionTips) {
        if (this.fashionTips != null) {
            this.fashionTips.forEach(i -> i.setAuthor(null));
        }
        if (fashionTips != null) {
            fashionTips.forEach(i -> i.setAuthor(this));
        }
        this.fashionTips = fashionTips;
    }

    public UserProfile fashionTips(Set<FashionTip> fashionTips) {
        this.setFashionTips(fashionTips);
        return this;
    }

    public UserProfile addFashionTips(FashionTip fashionTip) {
        this.fashionTips.add(fashionTip);
        fashionTip.setAuthor(this);
        return this;
    }

    public UserProfile removeFashionTips(FashionTip fashionTip) {
        this.fashionTips.remove(fashionTip);
        fashionTip.setAuthor(null);
        return this;
    }

    public Set<UserMilestone> getUserMilestones() {
        return this.userMilestones;
    }

    public void setUserMilestones(Set<UserMilestone> userMilestones) {
        if (this.userMilestones != null) {
            this.userMilestones.forEach(i -> i.setUserProfile(null));
        }
        if (userMilestones != null) {
            userMilestones.forEach(i -> i.setUserProfile(this));
        }
        this.userMilestones = userMilestones;
    }

    public UserProfile userMilestones(Set<UserMilestone> userMilestones) {
        this.setUserMilestones(userMilestones);
        return this;
    }

    public UserProfile addUserMilestone(UserMilestone userMilestone) {
        this.userMilestones.add(userMilestone);
        userMilestone.setUserProfile(this);
        return this;
    }

    public UserProfile removeUserMilestone(UserMilestone userMilestone) {
        this.userMilestones.remove(userMilestone);
        userMilestone.setUserProfile(null);
        return this;
    }

    public Set<Chatroom> getChatrooms() {
        return this.chatrooms;
    }

    public void setChatrooms(Set<Chatroom> chatrooms) {
        this.chatrooms = chatrooms;
    }

    public UserProfile chatrooms(Set<Chatroom> chatrooms) {
        this.setChatrooms(chatrooms);
        return this;
    }

    public UserProfile addChatroom(Chatroom chatroom) {
        this.chatrooms.add(chatroom);
        return this;
    }

    public UserProfile removeChatroom(Chatroom chatroom) {
        this.chatrooms.remove(chatroom);
        return this;
    }

    public Calendar getCalendar() {
        return this.calendar;
    }

    public void setCalendar(Calendar calendar) {
        if (this.calendar != null) {
            this.calendar.setUserProfile(null);
        }
        if (calendar != null) {
            calendar.setUserProfile(this);
        }
        this.calendar = calendar;
    }

    public UserProfile calendar(Calendar calendar) {
        this.setCalendar(calendar);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfile)) {
            return false;
        }
        return id != null && id.equals(((UserProfile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", profilePicture='" + getProfilePicture() + "'" +
            ", profilePictureContentType='" + getProfilePictureContentType() + "'" +
            ", lastSeen='" + getLastSeen() + "'" +
            ", location='" + getLocation() + "'" +
            ", privacy='" + getPrivacy() + "'" +
            "}";
    }
}
