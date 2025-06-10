import '../../css/message_css/message.css';
import FriendLeft from '../message/FriendLeft';
import FriendRight from '../message/FriendRight';
import Information from '../myInfo/Information';

const MyPageLayout = () => {


    return (
        <div className="friend-container">
            <FriendLeft />
            <FriendRight />
            <Information />
        </div>
    );
};
export default MyPageLayout;
