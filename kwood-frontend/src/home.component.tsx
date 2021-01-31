import { SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { getViewableForms } from './actions';

function HomeComponent() {
    const dispatch = useDispatch();
    dispatch(getViewableForms([]))
    return (
        <div id='home'>
            <div className='photoAndQuoteBlue'>
                <div className='leftImg'>
                <img
                    className = 'img float-left'
                    src={'https://onlinestore-img.finalfantasyxiv.com/onlinestore/item/986af49fd6809cb86dec896ca7b9805c5a6fae0ab017296f3523bcc6cc6a5d4/0019/6e23040ab0b6198fcddc67123c7959f542e0655a743e787f24dc105604a6a22e_sub1_detail.jpg'}
                    alt={'A female Au Ra and male Hyur in Garlond Ironworks uniforms'}
                />
                </div>
                <p className = 'quote'>"Don't ask what the source can do for you, <br />  but what you can do for the source." <br />&emsp; &emsp;- Cid Garlond</p>

            </div>
            <div className='photoAndQuoteYellow'>
                <p className = 'quote'>Kweh! <br/>&emsp; -Alpha</p>
                <div className = 'rightImg'>
                    <img
                        className = 'img float-right'
                        src={'https://images.mmorpg.com/features/13097/images/FFXIV%20Oct11%202.jpg'}
                        alt={'Aplha and Omega'}
                    />
                </div>
            </div>
        </div>
    )
}

export default HomeComponent;