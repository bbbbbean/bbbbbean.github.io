import '../../css/message_css/message.css';
import FriendLeft from '../message/FriendLeft';
import FriendRight from '../message/FriendRight';

const FriendLayout = () => {


    return (
        <div className="friend-container">
            <FriendLeft />
            <FriendRight />
        </div>
    );
};
export default FriendLayout;
