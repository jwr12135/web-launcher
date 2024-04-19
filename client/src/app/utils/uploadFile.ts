export default async function uploadFile(
  type: 'text' | 'raw',
  accept?: string,
): Promise<{name: string; data: string}> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (accept) input.accept = accept;

    input.addEventListener(
      'change',
      () => {
        if (input.files) {
          const {name} = input.files[0];
          if (type === 'text') {
            input.files[0].text().then((value) => {
              input.remove();
              resolve({name, data: value});
            });
          } else {
            const reader = new FileReader();
            reader.addEventListener(
              'load',
              () => {
                input.remove();
                resolve({name, data: reader.result as string});
              },
              {once: true},
            );
            reader.readAsDataURL(input.files[0]);
          }
        } else input.remove();
      },
      {once: true},
    );

    input.click();
  });
}
