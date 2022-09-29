import { defineComponent, ref } from 'vue';
import { StorageManager } from '@hengshuai/helper';

const fetchData = (): Promise<IUser> => {
  console.log('fetch data...');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'helper',
        age: 10,
        address: '@hengshuai/helper',
      });
    });
  });
};

interface IUser {
  name: string;
  age: number;
  address: string;
}

export default defineComponent({
  name: 'Demo',
  setup() {
    const user = ref<IUser>();
    const getUser = async () => {
      if (StorageManager.local.get('user')) {
        user.value = StorageManager.local.get('user') as IUser;
        return;
      }
      user.value = await fetchData();
      StorageManager.local.set('user', user.value, 1);
    };
    return () => (
      <>
        <button onClick={getUser}>缓存</button>
        {user?.value && (
          <ul>
            <li>{user.value.name} </li>
            <li>{user.value.age} </li>
            <li>{user.value.address} </li>
          </ul>
        )}
      </>
    );
  },
});
