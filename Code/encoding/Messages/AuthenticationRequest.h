#pragma once

#include "Message.h"
#include <Structs/Mods.h>


struct AuthenticationRequest final : ClientMessage
{
    static constexpr ClientOpcode Opcode = kAuthenticationRequest;

    AuthenticationRequest() : ClientMessage(Opcode)
    {
    }

    virtual ~AuthenticationRequest() = default;

    void SerializeRaw(TiltedPhoques::Buffer::Writer& aWriter) const noexcept override;
    void DeserializeRaw(TiltedPhoques::Buffer::Reader& aReader) noexcept override;

    bool operator==(const AuthenticationRequest& achRhs) const noexcept
    {
        return GetOpcode() == achRhs.GetOpcode() && DiscordId == achRhs.DiscordId && SKSEActive == achRhs.SKSEActive &&
               MO2Active == achRhs.MO2Active && Token == achRhs.Token && Version == achRhs.Version &&
               UserMods == achRhs.UserMods && Username == achRhs.Username;
    }

    uint64_t DiscordId;
    bool SKSEActive;
    bool MO2Active; 
    String Token;
    String Version;
    Mods UserMods;
    String Username;
};
