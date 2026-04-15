
package org.example.entity;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {

    ELDERLYUSER,

    CAREGIVER ,

    FAMILYMEMBER,

    MANAGER,

    ROBOT,

    ADMINISTRATOR;

    @JsonCreator
    public static Role from(String value) {
        return Role.valueOf(value.toUpperCase());
    }

    
}
