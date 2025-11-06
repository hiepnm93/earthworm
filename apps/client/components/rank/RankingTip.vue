<template>

  <div
    class="absolute bottom-0 left-0 flex h-12 w-full flex-col items-center justify-center border-t border-gray-200 dark:border-gray-600"
  >

    <div class="flex items-center text-sm">
       <span class="font-bold">Của tôiXếp hạng：</span> <template v-if="isLoading"
        > <span>数据Đang向你飞奔而来……</span> </template
      > <template v-else-if="!isAuthenticated()"
        > <span>Đăng nhập后和小伙伴们một决高下！😊 </span> </template
      > <template v-else-if="rankingSelf && rankingSelf.rank !== -1"
        > <RankRankingBadge
          :rank="rankingSelf.rank"
          class="min-w-6"
        /> <span class="mx-2">/</span> <span>{{ rankingSelf.count }} 课</span> </template
      > <template v-else> <span>先去刷một课再来看看！👀</span> </template>
    </div>

  </div>

</template>

<script setup lang="ts">
import { isAuthenticated } from "~/services/auth";
import { type RankingSelf } from "~/types";

const { rankingSelf, isLoading } = defineProps<{
  rankingSelf: RankingSelf | null;
  isLoading: boolean;
}>();
</script>

