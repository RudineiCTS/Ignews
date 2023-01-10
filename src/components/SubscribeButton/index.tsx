import { useSession } from 'next-auth/react';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({priceId}:SubscribeButtonProps){
  const {data: session} = useSession();
  function handleSubscribe(){
    if(!session)
    return;

    
    
  }
  return(
    <button
    type="button"
    className={styles.subscribeButton}>
      Subscribe now
    </button>
  )
}