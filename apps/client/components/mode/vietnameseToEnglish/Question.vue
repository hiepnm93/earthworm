<template>

  <div class="text-center">

    <div class="mb-4 mt-10 text-2xl dark:text-gray-50">
       {{ courseStore.currentStatement?.vietnamese || "Sinh tồn hay hủy diệt, đó là một câu hỏi" }}
    </div>
     <MainQuestionInput />
  </div>

</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";

import { useCurrentStatementEnglishSound } from "~/composables/main/englishSound";
import { useAutoPlayEnglish } from "~/composables/user/sound";
import { useCourseStore } from "~/store/course";

const courseStore = useCourseStore();
const { playSound } = useCurrentStatementEnglishSound();
const { isAutoPlayEnglish } = useAutoPlayEnglish();

onMounted(() => {
  handleAutoPlayEnglish();
});

watch(
  () => courseStore.currentStatement,
  () => {
    handleAutoPlayEnglish();
  },
);

function handleAutoPlayEnglish() {
  if (isAutoPlayEnglish()) {
    playSound();
  }
}
</script>

