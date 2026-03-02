import React from 'react';
import styles from ".index.css";
import { Link2 } from 'lucide-react';

const FriendLinks = () => {

  const friendLinks = [
    { name: '中央网络', subtext: '全国网信系统' },
    { name: '人民网新闻', subtext: '新闻媒体平台' },
    { name: '央视网融媒', subtext: '融合媒体' },
    { name: '新华网', subtext: '国家通讯社' },
    { name: '新华网', subtext: '政务服务平台' },
    { name: '新华网', subtext: '新闻媒体平台' },
  ]

  return (
    <div className={styles.linksCard}>
      <div className={styles.linksTitle}>
        <Link2 size={16} />
        友情链接
      </div>
      <div className={styles.linksGrid}>
        {friendLinks.map((link, index) => (
          <div key={index} className={styles.linkItem}>
            <div style={{ fontWeight: 500, marginBottom: 2 }}>{link.name}</div>
            <div style={{ fontSize: 10, color: '#999' }}>{link.subtext}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendLinks;
