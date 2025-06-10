import '../../css/message_css/message.css';
import FriendLeft from '../message/FriendLeft';
import FriendRight from '../message/FriendRight';
import InformationPro from '../myInfo/InformationPro';

const MyPageLayout = () => {

    return (
        <div className="friend-container">
            <FriendLeft />
            <FriendRight />
            <InformationPro />
        </div>
    );
};
export default MyPageLayout;
