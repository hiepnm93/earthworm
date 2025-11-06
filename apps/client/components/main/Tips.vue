<template>

  <div class="relative flex h-32 items-center justify-center">

    <div class="z-10 hidden items-center justify-center min-[780px]:flex">
       <button
        v-for="keybinding in keybindings"
        @click="keybinding.eventFn"
        class="btn btn-ghost"
      >

        <div class="flex items-center justify-center gap-2 text-center">

          <div
            v-for="keyStr in parseShortcutKeys(keybinding.keys)"
            class="kbd"
          >
             {{ keyStr }}
          </div>

        </div>
         <span>{{ keybinding.text }}</span
        > </button
      >
    </div>
     <MainPrevAndNextBtn />
  </div>

</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

import Message from "~/components/main/Message/useMessage";
import { useAnswerTip } from "~/composables/main/answerTip";
import { useCurrentStatementEnglishSound } from "~/composables/main/englishSound";
import { useGameMode } from "~/composables/main/game";
import { useSummary } from "~/composables/main/summary";
import { useShortcutKeyMode } from "~/composables/user/shortcutKey";
import { isAuthenticated } from "~/services/auth";
import { useCourseStore } from "~/store/course";
import { useMasteredElementsStore } from "~/store/masteredElements";
import { cancelShortcut, parseShortcutKeys, registerShortcut } from "~/utils/keyboardShortcuts";
import { useAnswer } from "./QuestionInput/useAnswer";
import { useWrapperQuestionInput } from "./QuestionInput/useWrapperQuestionInput";

const { toggleAnswerTip, isAnswerTip } = useAnswerTip();
const { shortcutKeys } = useShortcutKeyMode();
const { playSound } = usePlaySound(shortcutKeys.value.sound);
const { handleMastered } = useMastered();
const { goToNextQuestion } = useAnswer();
const { showQuestion, isQuestion } = useGameMode();
const { submitAnswer } = useWrapperQuestionInput();
useShowAnswer(shortcutKeys.value.answer);

const keybindings = computed(() => {
  const questionItems = [
    {
      keys: "Enter",
      text: "Gửi",
      eventFn: () => {
        submitAnswer();
      },
    },
    {
      keys: shortcutKeys.value.answer,
      text: isAnswerTip() ? "Ẩn答案" : "Hiện答案",
      eventFn: () => {
        toggleAnswerTip();
      },
    },
  ];

  const answerItems = [
    {
      keys: "Enter",
      text: "Câu tiếp theo",
      eventFn: () => {
        goToNextQuestion();
      },
    },
    {
      keys: shortcutKeys.value.answer,
      text: "Làm lại",
      eventFn: () => {
        showQuestion();
      },
    },
  ];

  const normalItems = [
    {
      keys: shortcutKeys.value.sound,
      text: "Phát发音",
      eventFn: playSound,
    },
    {
      keys: shortcutKeys.value.mastered,
      text: "掌握啦",
      eventFn: handleMastered,
    },
  ];

  const resultItems: any = [...normalItems];

  if (isQuestion()) {
    resultItems.push(...questionItems);
  } else {
    resultItems.push(...answerItems);
  }

  return resultItems;
});

function useMastered() {
  const { shortcutKeys } = useShortcutKeyMode();
  const courseStore = useCourseStore();
  const masteredElements = useMasteredElementsStore();
  const { showQuestion } = useGameMode();
  const { showSummary } = useSummary();

  const addLoading = ref(false);
  async function handleMastered() {
    if (!isAuthenticated()) {
      Message.warning("需要Đăng nhập哦");
      return;
    }

    // updateMarketedStatements 会影响 isLastStatement Quay lại的结果
    // 所以我们提前调用 isLastStatement 来记录好值
    if (addLoading.value) return;
    const isLastStatement = courseStore.isLastStatement();
    addLoading.value = true;
    await masteredElements.addElement({
      english: courseStore.currentStatement?.english!,
    });
    addLoading.value = false;

    courseStore.updateMarketedStatements();

    if (isLastStatement) {
      showSummary();
    } else {
      // 看看消完之后 是否Tất cả都没有了
      // 这cái是在 updatemarketedStatements 之后
      // 处理的 case 比如只剩下2cái good ，那么消除mộtcái good 之后 那么Danh sách就应该为0了
      if (courseStore.isAllMastered()) {
        showSummary();
        return;
      }
      courseStore.toNextStatement();
      showQuestion();
    }
  }

  onMounted(() => {
    registerShortcut(shortcutKeys.value.mastered, handleMastered);
  });

  onUnmounted(() => {
    cancelShortcut(shortcutKeys.value.mastered, handleMastered);
  });

  return {
    handleMastered,
  };
}

function usePlaySound(key: string) {
  const { playSound } = useCurrentStatementEnglishSound();

  onMounted(() => {
    registerShortcut(key, playSoundCommand);
  });

  onUnmounted(() => {
    cancelShortcut(key, playSoundCommand);
  });

  function playSoundCommand(e: KeyboardEvent) {
    e.preventDefault();
    playSound();
  }

  return {
    playSound,
  };
}

function useShowAnswer(key: string) {
  onMounted(() => {
    registerShortcut(key, handleShowAnswer);
  });

  onUnmounted(() => {
    cancelShortcut(key, handleShowAnswer);
  });

  function handleShowAnswer(e: KeyboardEvent) {
    e.preventDefault();
    // NOTE: registerShortcut 事件会记住Đăng ký时的面板状态，所以这里要重新获取下面板Thông tin
    const { showModal } = useSummary();
    if (showModal.value) return;

    const { isAnswer } = useGameMode();
    if (isAnswer()) {
      showQuestion();
    } else {
      toggleAnswerTip();
    }
  }
}
</script>

