import cn from 'classnames';

export default function SocialButton({ provider, children, ...rest }) {
  const className = cn(
    'flex-1 text-white rounded-md px-3 mt-3 py-2 font-medium',
    {
      'bg-red-500 hover:bg-red-400': provider === 'google',
      'bg-blue-500 hover:bg-blue-400': provider === 'facebook',
    }
  );

  return(
    <button className={className} {...rest}>
      <span className='flex justify-start items-center'>{children}</span>
    </button>
  );
}
