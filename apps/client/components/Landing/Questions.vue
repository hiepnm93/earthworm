<template>
  <section
    class="body-font overflow-hidden pt-24 text-gray-600"
    id="faq"
  >
    <CommonTitle
      title="常见问题解答"
      :description="[`如果您找不到所需的内容，请加入 Telegram 群组`, `我们会尽快Trả lời您！`]"
    />
    <div class="divide-y divide-gray-100 py-16 dark:divide-gray-800">
      <template
        v-for="(qsItem, qsIndex) in QUESTIONS"
        :key="qsIndex"
      >
        <details
          class="group"
          :open="qsIndex === 0"
        >
          <summary class="flex cursor-pointer items-center justify-between py-5">
            <h2 class="text-base font-medium text-black dark:text-gray-300 lg:text-lg">
              {{ qsItem.title }}
            </h2>
            <span class="icon i-ph-caret-right-bold h-6 w-6"></span>
          </summary>
          <div
            class="transition-max-height mb-4 overflow-hidden duration-500 ease-in-out dark:text-gray-500"
          >
            <template
              v-for="(asItem, asIndex) in qsItem.content"
              :key="`content-${asIndex}`"
            >
              <p class="py-2 text-sm lg:text-base">
                <span v-if="qsItem.content.length > 1">{{ asIndex + 1 }}. </span>
                {{ asItem }}
              </p>
            </template>
          </div>
        </details>
      </template>
    </div>
  </section>
  <CommonDivider />
</template>

<script setup lang="ts">
const QUESTIONS = [
  {
    title: "如何向开发团队提出Thêm的功能需求？",
    content: [
      "可以加入我们官方 Telegram 群组, 详细的描述您想要的功能以及告知这cái功能想要解决的问题是什么",
      "也可以去 github/issues 来Gửi您想要的功能需求",
    ],
  },
  {
    title: "如何向开发团队报告我在Áp dụng中遇到的Lỗi或漏洞？",
    content: [
      "如果您在Áp dụng中发现了Lỗi或漏洞，可以加入我们官方 Telegram 群组，提供详细的描述和重现问题的步骤，当然最好提供mộtcái小视频 🤪",
    ],
  },
  {
    title: "如何为 Earthworm 贡献代码？",
    content: [
      "我们提供了完整的贡献代码指南，可以先读một读(trang脚处有链接)",
      "去 github/issues 逛một逛， 也可以基于你在使用中遇到的问题提mộtcái issue 并且自己尝试修复",
    ],
  },
  {
    title: "Earthworm 项目是完全Miễn phí的吗？",
    content: [
      "不完全Miễn phí，因为想要长久发展Có phí是必然的。Chưa来会采用订阅模式，为Thành viên提供Thêm的Học tập内容和功能",
    ],
  },
];
</script>

<style scoped>
.icon {
  transition: transform 0.5s ease;
}

details[open] .icon {
  transform: rotate(90deg);
}

.transition-max-height {
  max-height: 0;
  transition: max-height 0.5s ease-in-out;
}

details[open] .transition-max-height {
  max-height: 500px;
}
</style>
