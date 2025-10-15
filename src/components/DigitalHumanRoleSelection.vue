<template>
  <div class="digital-human-role-selection">
    <div class="role-cards-container">
      <div
        v-for="(role, index) in roles"
        :key="role.id"
        class="role-card"
        :class="{ selected: selectedRole === role.id }"
        @click="selectRole(role.id)"
      >
        <div class="role-image-container">
          <img :src="role.image" :alt="role.name" class="role-image" />
          <div class="role-overlay">
            <div class="role-info">
              <h3 class="role-name">{{ role.name }}</h3>
              <p class="role-description">{{ role.description }}</p>
            </div>
          </div>
        </div>
        <div class="role-badge" v-if="selectedRole === role.id">
          <span class="check-icon">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import professionalImage from '@/assets/P1-64AzfrJY037WpS69RiUMw.png'
import assistantImage from '@/assets/P1OKp7AWZLC4bXw78Ms9ivuw.png'

interface Role {
  id: string
  name: string
  description: string
  image: string
}

// 使用assets目录中的图片
const roles = ref<Role[]>([
  {
    id: 'professional',
    name: '专业顾问',
    description: '提供专业咨询服务',
    image: professionalImage,
  },
  {
    id: 'assistant',
    name: '智能助手',
    description: '日常事务处理助手',
    image: assistantImage,
  },
])

const selectedRole = ref<string>('')

const selectRole = (roleId: string) => {
  selectedRole.value = selectedRole.value === roleId ? '' : roleId
}
</script>

<style lang="less" scoped>
.digital-human-role-selection {
  width: 100%;

  .role-cards-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;

    .role-card {
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 2px solid #f8f9fa;
      background: white;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        border-color: #e9ecef;
      }

      &.selected {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(120, 115, 246, 0.25);
        border: 2px solid #7873f6;
      }

      .role-image-container {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;

        .role-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.3s ease;
        }

        .role-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.6) 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;

          .role-info {
            color: white;
            text-align: center;
            width: 100%;

            .role-name {
              font-size: 18px;
              font-weight: 700;
              margin: 0 0 6px 0;
              text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
            }

            .role-description {
              font-size: 13px;
              margin: 0;
              opacity: 0.9;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
            }
          }
        }

        &:hover .role-overlay {
          opacity: 1;
        }
      }

      .role-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 28px;
        height: 28px;
        background: #7873f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(120, 115, 246, 0.4);
        border: 2px solid white;

        .check-icon {
          color: white;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .role-cards-container {
      gap: 12px;

      .role-card {
        border-radius: 10px;

        .role-image-container {
          height: 140px;

          .role-overlay {
            padding: 12px;

            .role-info {
              .role-name {
                font-size: 14px;
              }

              .role-description {
                font-size: 11px;
              }
            }
          }
        }

        .role-badge {
          width: 20px;
          height: 20px;
          top: 6px;
          right: 6px;

          .check-icon {
            font-size: 12px;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .role-cards-container {
      gap: 10px;

      .role-card {
        border-radius: 8px;

        .role-image-container {
          height: 120px;

          .role-overlay {
            padding: 10px;

            .role-info {
              .role-name {
                font-size: 13px;
              }

              .role-description {
                font-size: 10px;
              }
            }
          }
        }

        .role-badge {
          width: 18px;
          height: 18px;
          top: 4px;
          right: 4px;

          .check-icon {
            font-size: 10px;
          }
        }
      }
    }
  }
}
</style>
