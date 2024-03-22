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

    @OneToMany(mappedBy = "chatroom")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sender", "chatroom" }, allowSetters = true)
    private Set<ChatMessage> chatMessages = new HashSet<>();

    @ManyToOne
    private User creator;

    @ManyToOne
    private User recipient;

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

    public Set<ChatMessage> getChatMessages() {
        return this.chatMessages;
    }

    public void setChatMessages(Set<ChatMessage> chatMessages) {
        if (this.chatMessages != null) {
            this.chatMessages.forEach(i -> i.setChatroom(null));
        }
        if (chatMessages != null) {
            chatMessages.forEach(i -> i.setChatroom(this));
        }
        this.chatMessages = chatMessages;
    }

    public Chatroom chatMessages(Set<ChatMessage> chatMessages) {
        this.setChatMessages(chatMessages);
        return this;
    }

    public Chatroom addChatMessages(ChatMessage chatMessage) {
        this.chatMessages.add(chatMessage);
        chatMessage.setChatroom(this);
        return this;
    }

    public Chatroom removeChatMessages(ChatMessage chatMessage) {
        this.chatMessages.remove(chatMessage);
        chatMessage.setChatroom(null);
        return this;
    }

    public User getCreator() {
        return this.creator;
    }

    public void setCreator(User user) {
        this.creator = user;
    }

    public Chatroom creator(User user) {
        this.setCreator(user);
        return this;
    }

    public User getRecipient() {
        return this.recipient;
    }

    public void setRecipient(User user) {
        this.recipient = user;
    }

    public Chatroom recipient(User user) {
        this.setRecipient(user);
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
            "}";
    }
}
