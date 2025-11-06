<template>
  <div class="flex w-full flex-col">
    <h2 class="mb-4 text-center text-3xl dark:border-gray-600">Gói khóa họcDanh sách</h2>
    <template v-if="isLoading">
      <Loading></Loading>
    </template>
    <template v-else>
      <div class="h-[79vh] overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div
          class="grid auto-rows-fr grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-0 md:grid-cols-3 lg:grid-cols-4"
        >
          <template v-for="coursePack in coursePackStore.coursePacks">
            <CoursePackCard
              :coursePack="{
                id: coursePack.id,
                title: coursePack.title,
                description: coursePack.description,
                cover: coursePack.cover,
                isFree: coursePack.isFree,
              }"
              @cardClick="handleGoToCoursePack"
            ></CoursePackCard>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { CoursePack } from "~/types";
import CoursePackCard from "~/components/courses/CoursePackCard.vue";
import { useNavigation } from "~/composables/useNavigation";
import { useCoursePackStore } from "~/store/coursePack";

const coursePackStore = useCoursePackStore();
const { gotoCourseList } = useNavigation();
const isLoading = ref(false);

setup();

async function setup() {
  // Gói khóa học不会更新 所以初始化的时候只拉取mộtlần数据就好了
  if (coursePackStore.coursePacks.length === 0) {
    isLoading.value = true;
    await coursePackStore.setupCoursePacks();
    isLoading.value = false;
  }
}

function handleGoToCoursePack(coursePack: CoursePack) {
  if (coursePack.isFree) {
    gotoCourseList(coursePack.id);
  } else {
    // 看看是不是Thành viên 不是的话 直接弹出Tin nhắn告知 需要是Thành viên
    // TODO 还没有检测是不是Thành viên的功能函数
    console.log("需要是Thành viên");
  }
}
</script>

<style></style>
