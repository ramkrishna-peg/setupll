export default {
    type: 'select',
    title: 'How do you want to run LavaLink?',
    key: 'mode',
    items: [
        { label: 'Local / Bare Metal', value: 'local' },
        { label: 'Docker', value: 'docker' },
    ],
};
