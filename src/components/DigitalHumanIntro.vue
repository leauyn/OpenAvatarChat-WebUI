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
  margin-bottom: 16px;

  .intro-image-container {
    position: relative;
    width: 100%;
    height: 45vh; // 占据约45%的视口高度
    min-height: 280px;
    max-height: 400px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);
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
        rgba(0, 0, 0, 0.2) 0%,
        rgba(0, 0, 0, 0.1) 40%,
        rgba(0, 0, 0, 0.6) 100%
      );
      display: flex;
      align-items: flex-end;
      padding: 32px;

      .intro-content {
        color: white;
        max-width: 85%;

        .intro-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 16px 0;
          text-shadow: 0 3px 12px rgba(0, 0, 0, 0.5);
          line-height: 1.1;
        }

        .intro-description {
          font-size: 18px;
          line-height: 1.5;
          margin: 0;
          opacity: 0.95;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    margin-bottom: 16px;

    .intro-image-container {
      height: 40vh;
      min-height: 240px;
      max-height: 320px;
      border-radius: 12px;

      .intro-overlay {
        padding: 24px;

        .intro-content {
          .intro-title {
            font-size: 24px;
          }

          .intro-description {
            font-size: 14px;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;

    .intro-image-container {
      height: 35vh;
      min-height: 200px;
      max-height: 280px;
      border-radius: 10px;

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

  @media (max-width: 360px) {
    .intro-image-container {
      height: 30vh;
      min-height: 180px;
      max-height: 240px;

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
