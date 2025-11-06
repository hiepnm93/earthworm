<template>
   <CommonModal
    :show-modal="showModal"
    tw-class="max-w-[48rem]"
    >
    <div class="relative">

      <h3 className="font-bold text-lg mb-4">🎉 Congratulations!</h3>
       <button
        tabindex="0"
        class="btn btn-ghost btn-sm absolute right-0 top-0 mx-1 h-7 w-7 rounded-md p-0"
        @click="soundSentence"
      >
         <span class="i-ph-speaker-simple-high h-full w-full"></span> </button
      >
    </div>

    <div class="flex flex-col">

      <div class="flex">
         <span class="text-6xl font-bold">"</span>
        <div class="flex-1 text-center text-xl leading-loose"> {{ enSentence }} </div>
         <span class="invisible text-6xl font-bold">"</span>
      </div>

      <div class="flex">
         <span class="invisible text-6xl font-bold">"</span>
        <div class="flex-1 text-center text-xl leading-loose"> {{ zhSentence }} </div>
         <span class="text-6xl font-bold">"</span>
      </div>

      <p class="text-3 text-right text-gray-200">—— 金山词霸「每日một句」</p>

      <p class="pl-14 text-base leading-loose text-gray-600">
         {{
          `Chúc mừng您một共Hoàn thành ${courseTimer.totalRecordNumber()} 道题，用时 ${formatSecondsToTime(
            courseTimer.calculateTotalTime(),
          )} `
        }}
      </p>

      <p
        v-if="isAuthenticated()"
        class="pl-14 text-base leading-loose text-gray-400"
      >
         Hôm naymột共Học tập <span class="text-purple-500">{{ formattedMinutes }}phút</span> 啦！
        <span v-if="totalMinutes >= 30">太强了，给自己来点掌声 😄</span>
      </p>

    </div>

    <div className="modal-action">
       <button
        class="btn btn-primary"
        @click="toShare"
      >
         生成Điểm danh图 </button
      > <button
        class="btn"
        @click="handleDoAgain"
      >
         Làm lại </button
      > <button
        class="btn"
        @click="handleGoToCourseList"
      >
         Khóa họcDanh sách </button
      > <button
        class="btn"
        @click="goToNextCourse"
      >
         下một课 <kbd class="kbd"> ↵ </kbd> </button
      >
    </div>
     </CommonModal
  > <canvas
    ref="confettiCanvasRef"
    class="pointer-events-none absolute left-0 top-0 z-[1000] h-full w-full"
  ></canvas
  >
</template>

<script setup lang="ts">
import delay from "lodash-es/delay";
import { computed, ref, watch } from "vue";

import Message from "~/components/main/Message/useMessage";
import { useActiveCourseMap } from "~/composables/courses/activeCourse";
import { courseTimer } from "~/composables/courses/courseTimer";
import { useAuthRequire } from "~/composables/main/authRequire";
import { useConfetti } from "~/composables/main/confetti/useConfetti";
import { readOneSentencePerDayAloud } from "~/composables/main/englishSound";
import { useGameMode } from "~/composables/main/game";
import { useLearningTimeTracker } from "~/composables/main/learningTimeTracker";
import { useShareModal } from "~/composables/main/shareImage/share";
import { useDailySentence, useSummary } from "~/composables/main/summary";
import { useNavigation } from "~/composables/useNavigation";
import { isAuthenticated } from "~/services/auth";
import { useCourseStore } from "~/store/course";
import { useCoursePackStore } from "~/store/coursePack";
import { useGameStore } from "~/store/game";
import { permitSaveStatement, preventSaveStatement } from "~/store/statement";
import { formatSecondsToTime } from "~/utils/date";
import { cancelShortcut, registerShortcut } from "~/utils/keyboardShortcuts";

const courseStore = useCourseStore();
const coursePackStore = useCoursePackStore();
const { gotoCourseList, gotoGame } = useNavigation();
const { handleGoToCourseList, goToNextCourse, completeCourse } = useCourse();
const { handleDoAgain } = useDoAgain();
const { showModal, hideSummary } = useSummary();
const { zhSentence, enSentence } = useDailySentence();
const { confettiCanvasRef, playConfetti } = useConfetti();
const { showShareModal } = useShareModal();
const { updateActiveCourseMap } = useActiveCourseMap();
const { totalMinutes, formattedMinutes } = useTotalLearningTime();
const gameStore = useGameStore();

watch(showModal, (val) => {
  if (val) {
    // 阻止包含 statement Hoàn thànhKhóa học后会自动把Người dùng的Tiến độCài đặt成下một课
    // 这里是为了防止先Cài đặt成下một课 后更新了 statement 的Tiến độ
    // 这就会造成获取Người dùngGần đây的Gói khóa họcTiến độ出现Lỗi  因为是基于时间来获取的
    preventSaveStatement();
    // Đăng ký回车键进入下một课
    registerShortcut("enter", goToNextCourse);
    // Hiện结算面板代表当前Khóa họcĐã经Hoàn thành
    completeCourse();
    // 朗读每日một句
    soundSentence();
    // 延迟một小会放彩蛋
    // Dừng计时
    gameStore.completeLevel();
    setTimeout(async () => {
      playConfetti();
    }, 300);
  } else {
    // Hủy回车键进入下một课
    cancelShortcut("enter", goToNextCourse);
    permitSaveStatement();
  }
});

function useTotalLearningTime() {
  const { totalSeconds } = useLearningTimeTracker();
  const totalMinutes = computed(() => Math.ceil(totalSeconds.value / 60));

  const formattedMinutes = computed(() => {
    return Math.max(totalMinutes.value, 1).toString();
  });

  return {
    totalMinutes,
    formattedMinutes,
  };
}

function useDoAgain() {
  const { showQuestion } = useGameMode();

  async function handleDoAgain() {
    // 看看是不是没有Tất cả掌握了
    // 如果是Tất cả掌握了 那么给cáiGợi ý 然后挑战到Khóa họcDanh sách
    if (courseStore.isAllMastered()) {
      Message.warning("你Đã经Tất cả都掌握 自动帮你跳转到Khóa họcDanh sách啦");
      await delay(handleGoToCourseList, 1500);
      return;
    }
    courseStore.doAgain();
    hideSummary();
    showQuestion();
    courseTimer.reset();
    gameStore.startGame();
  }

  return {
    handleDoAgain,
  };
}

// 朗读每日một句
function soundSentence() {
  readOneSentencePerDayAloud(enSentence.value);
}

function useCourse() {
  let nextCourseId = ref("");

  const haveNextCourse = computed(() => {
    return nextCourseId.value;
  });

  async function goToNextCourse() {
    const { showAuthRequireModal } = useAuthRequire();

    if (!isAuthenticated()) {
      // 去Đăng ký
      showAuthRequireModal();
      return;
    }

    hideSummary();

    if (!haveNextCourse.value) {
      Message.warning("Đã经是最后một课 自动帮你跳转到Khóa họcDanh sách啦");
      await delay(handleGoToCourseList, 1500);
      return;
    }

    if (courseStore.currentCourse) {
      gotoGame(courseStore.currentCourse.coursePackId, nextCourseId.value);
    }
  }

  function handleGoToCourseList() {
    hideSummary();
    if (courseStore.currentCourse) {
      gotoCourseList(courseStore.currentCourse.coursePackId);
    }
  }

  async function completeCourse() {
    if (isAuthenticated() && courseStore.currentCourse) {
      const { coursePackId } = courseStore.currentCourse;
      const { nextCourse } = await courseStore.completeCourse();
      coursePackStore.updateCoursesCompleteCount(coursePackId);

      if (nextCourse) {
        nextCourseId.value = nextCourse.id;
        updateActiveCourseMap(coursePackId, nextCourseId.value);
      } else {
        updateActiveCourseMap(coursePackId, "");
      }
    }
  }

  return {
    completeCourse,
    goToNextCourse,
    handleGoToCourseList,
  };
}

const toShare = () => {
  showShareModal();
};
</script>

