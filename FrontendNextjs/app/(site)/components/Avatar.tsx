import Image from 'next/image'

interface AvatarProps {
  user: {
    image?: string | null
  }
}

const Avatar = ({ user }: AvatarProps) => {
  return (
    <div
      className="
        relative
        inline-block
        rounded-full
        h-9
        w-9
        mx-auto
        shadow-md
        border
      "
    >
      <Image
        priority
        alt="Avatar"
        src={user?.image || '/images/avt.png'}
        fill
        sizes="36px"
        className="rounded-full"
      />
    </div>
  )
}

export default Avatar
