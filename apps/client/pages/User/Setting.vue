<template>
  <div
    class="mx-auto my-8 w-full max-w-screen-lg space-y-8 rounded-lg bg-base-100 px-6 py-8 shadow-even-lg dark:bg-gray-900 dark:shadow-gray-700 md:px-12"
  >
    <section>
      <h2 class="text-xl font-medium">游戏模式</h2>
      <table class="table text-base">
        <tbody>
          <tr class="hover">
            <td class="label-text">模式</td>
            <td class="text-right">
              <div class="join">
                <input
                  v-for="mode in getGameModeOptions()"
                  class="btn join-item btn-sm"
                  type="radio"
                  name="gameMode"
                  :value="mode.value"
                  :aria-label="mode.label"
                  :checked="currentGameMode === mode.value"
                  @change="toggleGameMode(mode.value as GameMode)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2 class="text-xl font-medium">快捷键Cài đặt</h2>
      <table class="table text-base">
        <thead>
          <tr class="text-base">
            <th class="">功能</th>
            <th class="w-1/6 text-center">快捷键</th>
            <th class="w-2/6 pr-6 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in shortcutKeyBindList">
            <tr class="hover">
              <td class="label-text">{{ item.label }}</td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-2 text-center text-xs">
                  <div
                    class="kbd"
                    v-for="key in parseShortcutKeys(shortcutKeys[item.type])"
                  >
                    {{ key }}
                  </div>
                </div>
              </td>
              <td class="text-right">
                <button
                  class="btn btn-outline btn-secondary btn-sm"
                  @click="handleEdit(item.type)"
                >
                  Chỉnh sửa
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>

    <section>
      <h2 class="text-xl font-medium">声音Cài đặt</h2>
      <table class="table">
        <tbody>
          <tr class="hover">
            <td class="label-text">开启键盘打字音效</td>
            <td class="text-right">
              <input
                type="checkbox"
                class="toggle toggle-secondary"
                :checked="keyboardSound"
                @change="toggleKeyboardSound"
              />
            </td>
          </tr>
          <tr class="hover">
            <td class="label-text">答案trang面自动Phát声音</td>
            <td class="text-right">
              <input
                type="checkbox"
                class="toggle toggle-secondary"
                :checked="autoPlaySound"
                @change="toggleAutoPlaySound"
              />
            </td>
          </tr>
          <tr class="hover">
            <td class="label-text">答题时自动Phát声音</td>
            <td class="text-right">
              <input
                type="checkbox"
                class="toggle toggle-secondary"
                :checked="autoPlayEnglish"
                @change="toggleAutoPlayEnglish"
              />
            </td>
          </tr>
          <tr class="hover">
            <td class="label-text">切换口音</td>
            <td class="text-right">
              <div class="join">
                <input
                  v-for="lang in getPronunciationOptions()"
                  class="btn join-item btn-sm"
                  type="radio"
                  name="options"
                  :value="lang.value"
                  :aria-label="lang.label"
                  :checked="pronunciation === lang.value"
                  @change="togglePronunciation(lang.value as PronunciationType)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2 class="text-xl font-medium">答题Cài đặt</h2>
      <table class="table">
        <tbody>
          <tr class="hover">
            <td class="label-text">Hiện每cái单词长度</td>
            <td class="text-right">
              <input
                type="checkbox"
                class="toggle toggle-secondary"
                :checked="showWordsWidth"
                @change="toggleAutoWordsWidth"
              />
            </td>
          </tr>
          <tr class="hover">
            <td class="label-text">开启空格Gửi答案</td>
            <td class="text-right">
              <input
                type="checkbox"
                class="toggle toggle-secondary"
                :checked="useSpace"
                @change="toggleUseSpaceSubmitAnswer"
              />
            </td>
          </tr>
          <tr class="hover">
            <td class="label-text">答题正确后自动Câu tiếp theo</td>
            <td class="text-right">
              <input
                type="checkbox"
                class="toggle toggle-secondary"
                :checked="autoNextQuestion"
                @change="toggleAutoQuestion"
              />
            </td>
          </tr>

          <tr class="hover">
            <td class="label-text">自动Hiện答案（输错balần）</td>
            <td class="text-right">
              <input
                type="checkbox"
                class="toggle toggle-secondary"
                :checked="showErrorTip"
                @change="toggleShowErrorTip"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  <dialog
    class="modal mt-[-8vh]"
    :open="showModal"
  >
    <div
      ref="dialogBoxRef"
      class="modal-box min-h-[156px] max-w-[48rem]"
    >
      <h3 class="mb-4 text-center text-base font-bold text-fuchsia-500">
        请先按下单键/组合键，通过回车键（Enter ⏎）来Cài đặt
      </h3>
      <div class="h-8 rounded border border-solid border-fuchsia-500 text-center leading-8">
        {{ shortcutKeyStr }}
      </div>
      <div
        v-if="shortcutKeyTip"
        class="mt-2 flex justify-center gap-2 text-center text-xs"
      >
        <div
          v-for="key in parseShortcutKeys(shortcutKeyTip)"
          class="kbd"
        >
          {{ key }}
        </div>
      </div>
      <div
        v-if="hasSameShortcutKey"
        class="mt-4 text-center text-xs"
        :class="'text-[rgba(136,136,136,1)]'"
      >
        Đã有相同的按键绑定，请重新Cài đặt
      </div>
    </div>

    <!-- click outside to close -->
    <form
      method="dialog"
      class="modal-backdrop"
    >
      <button @click="handleCloseDialog"></button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import Message from "~/components/main/Message/useMessage";
import { useAutoNextQuestion } from "~/composables/user/autoNext";
import { useErrorTip } from "~/composables/user/errorTip";
import { GameMode, useGameMode } from "~/composables/user/gameMode";
import { PronunciationType, usePronunciation } from "~/composables/user/pronunciation";
import { SHORTCUT_KEY_TYPES, useShortcutKeyMode } from "~/composables/user/shortcutKey";
import {
  useAutoPlayEnglish,
  useAutoPronunciation,
  useKeyboardSound,
} from "~/composables/user/sound";
import { useSpaceSubmitAnswer } from "~/composables/user/submitKey";
import { useShowWordsWidth } from "~/composables/user/words";
import { parseShortcutKeys } from "~/utils/keyboardShortcuts";

const dialogBoxRef = ref<HTMLElement | null>(null);

const { autoNextQuestion, toggleAutoQuestion } = useAutoNextQuestion();
const { keyboardSound, toggleKeyboardSound } = useKeyboardSound();
const { autoPlaySound, toggleAutoPlaySound } = useAutoPronunciation();
const { autoPlayEnglish, toggleAutoPlayEnglish } = useAutoPlayEnglish();
const {
  pronunciation,
  // 发音配置Danh sách
  getPronunciationOptions,
  togglePronunciation,
} = usePronunciation();
const { showWordsWidth, toggleAutoWordsWidth } = useShowWordsWidth();
const { useSpace, toggleUseSpaceSubmitAnswer } = useSpaceSubmitAnswer();
const { showErrorTip, toggleShowErrorTip } = useErrorTip();
const {
  showModal,
  shortcutKeys,
  shortcutKeyStr,
  shortcutKeyTip,
  hasSameShortcutKey,
  handleEdit,
  handleCloseDialog,
  handleKeydown,
} = useShortcutKeyMode();

const { getGameModeOptions, currentGameMode, toggleGameMode } = useGameMode();

const shortcutKeyBindList = [
  {
    label: "Phát发音",
    type: SHORTCUT_KEY_TYPES.SOUND,
  },
  {
    label: "HiệnẨn/答案预览/Làm lại",
    type: SHORTCUT_KEY_TYPES.ANSWER,
  },
  {
    label: "Quay lại上cái问题",
    type: SHORTCUT_KEY_TYPES.PREVIOUS,
  },
  {
    label: "Bỏ qua当前问题",
    type: SHORTCUT_KEY_TYPES.SKIP,
  },
  {
    label: "Đánh dấu内容Đã经掌握",
    type: SHORTCUT_KEY_TYPES.MASTERED,
  },
  {
    label: "Tạm dừng游戏/Tiếp tục游戏",
    type: SHORTCUT_KEY_TYPES.PAUSE,
  },
];

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.btn-outline.btn-secondary:hover,
.toggle-secondary:checked,
.btn:is(input[type="radio"]:checked) {
  @apply border-fuchsia-500 bg-fuchsia-500 text-[#ffffff];
}

.btn-outline.btn-secondary {
  @apply text-fuchsia-500 outline-fuchsia-500;
}

section > h2 {
  @apply border-b pb-4;
}
</style>
