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
 * A MilestoneType.
 */
@Entity
@Table(name = "milestone_type")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MilestoneType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "initial_target", nullable = false)
    private Long initialTarget;

    @Column(name = "next_target")
    private Long nextTarget;

    @OneToMany(mappedBy = "milestoneType")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "milestoneType", "userProfile" }, allowSetters = true)
    private Set<UserMilestone> types = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MilestoneType id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public MilestoneType name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getInitialTarget() {
        return this.initialTarget;
    }

    public MilestoneType initialTarget(Long initialTarget) {
        this.setInitialTarget(initialTarget);
        return this;
    }

    public void setInitialTarget(Long initialTarget) {
        this.initialTarget = initialTarget;
    }

    public Long getNextTarget() {
        return this.nextTarget;
    }

    public MilestoneType nextTarget(Long nextTarget) {
        this.setNextTarget(nextTarget);
        return this;
    }

    public void setNextTarget(Long nextTarget) {
        this.nextTarget = nextTarget;
    }

    public Set<UserMilestone> getTypes() {
        return this.types;
    }

    public void setTypes(Set<UserMilestone> userMilestones) {
        if (this.types != null) {
            this.types.forEach(i -> i.setMilestoneType(null));
        }
        if (userMilestones != null) {
            userMilestones.forEach(i -> i.setMilestoneType(this));
        }
        this.types = userMilestones;
    }

    public MilestoneType types(Set<UserMilestone> userMilestones) {
        this.setTypes(userMilestones);
        return this;
    }

    public MilestoneType addType(UserMilestone userMilestone) {
        this.types.add(userMilestone);
        userMilestone.setMilestoneType(this);
        return this;
    }

    public MilestoneType removeType(UserMilestone userMilestone) {
        this.types.remove(userMilestone);
        userMilestone.setMilestoneType(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MilestoneType)) {
            return false;
        }
        return id != null && id.equals(((MilestoneType) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MilestoneType{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", initialTarget=" + getInitialTarget() +
            ", nextTarget=" + getNextTarget() +
            "}";
    }
}
