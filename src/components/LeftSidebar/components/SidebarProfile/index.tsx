import { useMemo } from "react";
import { parseImgUrl } from "@/utils/parse";
import dftAvatar from "@/assets/icons/navigation-avatar-default.svg";
import classNames from "classnames";
import style from "./index.less";
import { avatarFrame } from "@/assets/icons";

const SidebarProfile: React.FC<{ user: ObjectType, hiddenName?: boolean, hiddenEmail?: boolean, simpleAvatar?: boolean }> = ({ user, hiddenName = false, hiddenEmail = false, simpleAvatar = false }) => {
    const { currentMerchant,userInfo } = user;
    const avatarSrc = useMemo(() => currentMerchant?.visibleAvatar ? parseImgUrl(currentMerchant?.visibleAvatar) : dftAvatar, [currentMerchant?.visibleAvatar]);
    return (
        <div className={style['sidebar-profile']}>
            <div className={classNames('profile__avatar', { 'profile__avatar--simple': simpleAvatar })}>
                <img className="avatar__frame" src={avatarFrame} alt="" />
                <img className="avatar__merchant" src={avatarSrc} alt={currentMerchant?.name} />
            </div>
            {!hiddenName && <div className="profile__name">{currentMerchant?.name}</div>}
            {!hiddenEmail && <div className="profile__email">{currentMerchant?.userInfo?.email}</div>}
        </div>
    )
}
export default SidebarProfile;