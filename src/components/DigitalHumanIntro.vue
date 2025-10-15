<template>
  <div class="digital-human-intro">
    <div class="intro-image-container">
      <img :src="introImage" alt="数字人服务介绍" class="intro-image" />
      <div class="intro-overlay">
        <div class="intro-content">
          <h2 class="intro-title">智能数字人服务</h2>
          <p class="intro-description">
            体验前沿AI技术，与智能数字人进行自然对话，获得专业、贴心的服务体验
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import introImageSrc from '@/assets/boarding_back.png'

// 使用assets目录中的图片
const introImage = ref(introImageSrc)
</script>

<style lang="less" scoped>
.digital-human-intro {
  width: 100%;

  .intro-image-container {
    position: relative;
    width: 100%;
    height: 320px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 2px solid #e9ecef;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .intro-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .intro-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.3) 0%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.5) 100%
      );
      display: flex;
      align-items: flex-start;
      padding: 24px;

      .intro-content {
        color: white;
        max-width: 80%;

        .intro-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          line-height: 1.2;
        }

        .intro-description {
          font-size: 16px;
          line-height: 1.6;
          margin: 0;
          opacity: 0.95;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    margin-bottom: 20px;

    .intro-image-container {
      height: 240px;
      border-radius: 12px;

      .intro-overlay {
        padding: 20px;

        .intro-content {
          .intro-title {
            font-size: 20px;
          }

          .intro-description {
            font-size: 13px;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;

    .intro-image-container {
      height: 200px;
      border-radius: 10px;

      .intro-overlay {
        padding: 16px;

        .intro-content {
          .intro-title {
            font-size: 18px;
          }

          .intro-description {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
