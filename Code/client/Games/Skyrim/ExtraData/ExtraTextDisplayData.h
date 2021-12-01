#pragma once

#include <Games/ExtraData.h>
#include <Misc/BSFixedString.h>

struct ExtraTextDisplayData : BSExtraData
{
    BSFixedString DisplayName;

    // TODO: implement the rest when i dont feel lazy
    /*
    BGSMessage *pDisplayNameText;
    TESQuest *pOwnerQuest;
    uint32_t uiOwnerInstance;
    BSTArray<BSTTuple<BSFixedString,TESForm *>,BSTArrayHeapAllocator> *pTextPairA;
    unsigned __int16 usCustomNameLength;
    */
};
