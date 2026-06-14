import { useCallback, useEffect, useRef, useState } from "react";
import { useSiteContent } from "@/context/contentContext";
import { descToHtml, experienceToHtml } from "@/lib/html";
import { useModal } from "@/context/modalContext";
import { useTouchTeamMode } from "@/hooks/useMediaQuery";
import type { MemberId } from "@/types/member";



const TOOLTIP_EXIT_MS = 400;



export function useTeamInteraction() {

  const isTouchTeamMode = useTouchTeamMode();
  const { content } = useSiteContent();
  const members = content.team.members;

  const { openTeamMember, closeTeamMember, isTeamOpen, state } = useModal();



  const [activeMember, setActiveMember] = useState<MemberId | null>(null);

  const [displayMember, setDisplayMember] = useState<MemberId | null>(null);

  const [tooltipExpanded, setTooltipExpanded] = useState(false);

  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const freezeUntilRef = useRef(0);



  const cancelLeave = useCallback(() => {

    if (leaveTimerRef.current !== null) {

      clearTimeout(leaveTimerRef.current);

      leaveTimerRef.current = null;

    }

  }, []);



  const clearDisplayAfterExit = useCallback(() => {

    if (exitTimerRef.current !== null) {

      clearTimeout(exitTimerRef.current);

    }

    exitTimerRef.current = setTimeout(() => {

      exitTimerRef.current = null;

      setDisplayMember(null);

    }, TOOLTIP_EXIT_MS);

  }, []);



  const clearActive = useCallback(() => {

    cancelLeave();

    setActiveMember(null);

    setTooltipExpanded(false);

    if (displayMember) {

      clearDisplayAfterExit();

    } else {

      setDisplayMember(null);

    }

  }, [cancelLeave, clearDisplayAfterExit, displayMember]);



  const scheduleLeave = useCallback(() => {

    cancelLeave();

    const remaining = freezeUntilRef.current - Date.now();

    if (remaining > 0) {

      leaveTimerRef.current = setTimeout(scheduleLeave, remaining + 16);

      return;

    }

    leaveTimerRef.current = setTimeout(() => {

      leaveTimerRef.current = null;

      clearActive();

    }, 220);

  }, [cancelLeave, clearActive]);



  const activateMember = useCallback(

    (key: MemberId) => {

      cancelLeave();

      if (exitTimerRef.current !== null) {

        clearTimeout(exitTimerRef.current);

        exitTimerRef.current = null;

      }

      if (!members[key]) return;

      if (isTouchTeamMode) {
        if (isTeamOpen && state.type === "team" && state.memberId === key) {
          clearActive();
          closeTeamMember();
          return;
        }
        openTeamMember(key);
        return;
      }

      setActiveMember(key);
      setDisplayMember(key);
      setTooltipExpanded(false);
    },

    [

      cancelLeave,

      isTouchTeamMode,

      openTeamMember,

      closeTeamMember,

      clearActive,

      isTeamOpen,

      state,
      members,

    ],

  );



  const toggleTooltipDetail = useCallback(() => {

    if (!activeMember) return;

    freezeUntilRef.current = Date.now() + 1200;

    cancelLeave();

    setTooltipExpanded((v) => !v);

  }, [activeMember, cancelLeave]);



  useEffect(() => {

    if (!isTouchTeamMode) {

      closeTeamMember();

    }

  }, [isTouchTeamMode, closeTeamMember]);



  useEffect(() => {

    if (isTouchTeamMode && !isTeamOpen) {

      clearActive();

    }

  }, [isTouchTeamMode, isTeamOpen, clearActive]);



  useEffect(

    () => () => {

      cancelLeave();

      if (exitTimerRef.current !== null) {

        clearTimeout(exitTimerRef.current);

      }

    },

    [cancelLeave],

  );



  const showTooltip = Boolean(

    !isTouchTeamMode && (activeMember || displayMember),

  );

  const displayData = displayMember ? members[displayMember] : null;



  const tooltipHtml = displayData

    ? tooltipExpanded

      ? experienceToHtml(displayData.experience)

      : descToHtml(displayData.desc)

    : "";



  const tooltipClassName = [

    "tooltip",

    "tooltip--in-circle",

    showTooltip ? "is-active" : "",

    displayMember ? `tooltip--pos-${displayMember}` : "",

    tooltipExpanded ? "tooltip--expanded" : "",

  ]

    .filter(Boolean)

    .join(" ");



  return {

    isTouchTeamMode,

    activeMember,

    activeData: displayData,

    tooltipHtml,

    tooltipExpanded,

    tooltipClassName,

    activateMember,

    clearActive,

    scheduleLeave,

    cancelLeave,

    toggleTooltipDetail,

    circleClassName: `circle-container${activeMember ? " is-active" : ""}`,

    quarterClass: (id: MemberId) =>
      `team-quarter${!isTouchTeamMode && displayMember === id ? " is-hover" : ""}`,

  };

}


