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
    const field = ref('');
    const key = ref('');
    const val = ref('');
    const expire = ref<number>(-1);
    const user = ref<IUser>();
    const getUser = async () => {
      if (StorageManager.local.get('user')) {
        user.value = StorageManager.local.get('user') as IUser;
        return;
      }
      user.value = await fetchData();
      StorageManager.local.set('user', user.value, -1);
    };
    const handleClearCache = () => {
      StorageManager.local.field(field.value).remove(key.value);
    };
    const handleAddCache = () => {
      StorageManager.local
        .field(field.value)
        .set(key.value, val.value, expire.value);
    };
    return () => (
      <div>
        <div>
          <button onClick={getUser}>缓存</button>
          {user?.value && (
            <ul>
              <li>{user.value.name} </li>
              <li>{user.value.age} </li>
              <li>{user.value.address} </li>
            </ul>
          )}
        </div>
        <br />
        <div>
          <div>
            field: <input v-model={field.value} />
          </div>
          <div>
            key: <input v-model={key.value} />
          </div>
          <div>
            val: <input v-model={val.value} />
          </div>
          <div>
            expire: <input v-model={expire.value} />
          </div>
          <div>
            <button onClick={handleClearCache}>清除</button>
            <button onClick={handleAddCache}>添加</button>
          </div>
        </div>
      </div>
    );
  },
});
