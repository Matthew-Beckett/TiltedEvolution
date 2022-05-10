#pragma once

#include "Message.h"

#include <Structs/GameId.h>

struct NotifyPlayerJoined final : ServerMessage
{
    static constexpr ServerOpcode Opcode = kNotifyPlayerJoined;

    NotifyPlayerJoined() : 
        ServerMessage(Opcode)
    {
    }

    virtual ~NotifyPlayerJoined() = default;

    void SerializeRaw(TiltedPhoques::Buffer::Writer& aWriter) const noexcept override;
    void DeserializeRaw(TiltedPhoques::Buffer::Reader& aReader) noexcept override;

    bool operator==(const NotifyPlayerJoined& acRhs) const noexcept
    {
        return GetOpcode() == acRhs.GetOpcode() &&
               ServerId == acRhs.ServerId &&
               Username == acRhs.Username &&
               WorldSpaceId == acRhs.WorldSpaceId &&
               CellId == acRhs.CellId &&
               Level == acRhs.Level;
    }

    uint64_t ServerId;
    String Username;
    GameId WorldSpaceId;
    GameId CellId;
    uint16_t Level;
};
