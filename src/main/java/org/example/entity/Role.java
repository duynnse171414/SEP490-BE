import com.fasterxml.jackson.annotation.JsonCreator;

package org.example.entity;

public enum Role {

    ELDERLYUSER,

    CAREGIVER ,

    FAMILYMEMBER,

    MANAGER,

    ADMINISTRATOR;

    @JsonCreator
    public static Role from(String value) {
        return Role.valueOf(value.toUpperCase());
    }

    
}
