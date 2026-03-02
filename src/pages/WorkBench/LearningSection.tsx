import React from 'react';
import styles from "./index.css";
import { Play } from 'lucide-react';

const LearningSection = () => {

  const learningItems = [
    { title: '安全技能课程学习', image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&h=200&fit=crop' },
    { title: '安全技能课程学习', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', hasVideo: true },
    { title: '安全技能课程学习', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=200&fit=crop' },
    { title: '安全技能课程学习', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=200&fit=crop' },
    { title: '安全技能课程学习', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=200&fit=crop' },
  ]

  return (
    <div className={styles.learningSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>自主学习模块</span>
        <span className={styles.viewMore}>查看更多</span>
      </div>
      <div className={styles.learningGrid}>
        {learningItems.map((item, index) => (
          <div key={index} className={styles.learningCard}>
            <div className={styles.imageWrapper}>
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className={styles.learningImage}
              />
              {item.hasVideo && (
                <div className={styles.playButton}>
                  <Play size={20} fill="white" />
                </div>
              )}
            </div>
            <div className={styles.learningTitle}>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LearningSection;
