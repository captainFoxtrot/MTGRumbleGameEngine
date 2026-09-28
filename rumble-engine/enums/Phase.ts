export enum Phase {
    Untap = "UNTAP",
    Upkeep = "UPKEEP",
    Draw = "DRAW",

    PreCombatMain = "PRE_COMBAT_MAIN",

    CombatBeginning = "COMBAT_BEGINNING",
    CombatDeclareAttackers = "COMBAT_DECLARE_ATTACKERS",
    CombatDeclareBlockers = "COMBAT_DECLARE_BLOCKERS",
    CombatFirstStrikeDamage = "COMBAT_FIRST_STRIKE_DAMAGE",
    CombatDamage = "COMBAT_DAMAGE",
    CombatEnd = "COMBAT_END",

    PostCombatMain = "POST_COMBAT_MAIN",

    End = "END",
    Cleanup = "CLEANUP"
}