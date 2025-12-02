import { useState } from 'react';
import {
    ParchmentPanel,
    WesternButton,
    Modal,
    ConfirmDialog,
    WesternInput,
    WesternSelect,
    WesternCheckbox,
    ToastContainer
} from '../components/ui';
import { useToast } from '../hooks/useToast';

export const ComponentsShowcasePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        characterClass: 'adventurer',
        acceptTerms: false
    });

    const toast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Form submitted successfully!');
        console.log('Form data:', formData);
    };

    return (
        <div>
            <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                color: 'var(--color-leather-darkest)',
                marginBottom: 'var(--space-6)',
                textAlign: 'center'
            }}>
                UI Components Showcase
            </h1>

            {/* Toast Container */}
            <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                {/* Modals Section */}
                <ParchmentPanel title="Modal & Dialog">
                    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        <WesternButton onClick={() => setIsModalOpen(true)}>
                            Open Modal
                        </WesternButton>
                        <WesternButton variant="danger" onClick={() => setIsConfirmOpen(true)}>
                            Open Confirm Dialog
                        </WesternButton>
                    </div>

                    {/* Modal */}
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Example Modal"
                        size="md"
                    >
                        <p>This is a Western-themed modal dialog with smooth animations!</p>
                        <p style={{ marginTop: 'var(--space-4)' }}>
                            Press ESC or click outside to close, or use the button below:
                        </p>
                        <div style={{ marginTop: 'var(--space-5)' }}>
                            <WesternButton onClick={() => setIsModalOpen(false)}>
                                Close Modal
                            </WesternButton>
                        </div>
                    </Modal>

                    {/* Confirm Dialog */}
                    <ConfirmDialog
                        isOpen={isConfirmOpen}
                        onClose={() => setIsConfirmOpen(false)}
                        onConfirm={() => {
                            toast.success('Action confirmed!');
                        }}
                        title="Confirm Action"
                        message="Are you sure you want to proceed with this action? This cannot be undone."
                        variant="danger"
                        confirmText="Yes, Proceed"
                        cancelText="Cancel"
                    />
                </ParchmentPanel>

                {/* Form Inputs Section */}
                <ParchmentPanel title="Form Components" seal>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

                            {/* Text Input */}
                            <WesternInput
                                label="Username"
                                placeholder="Enter your cowboy name..."
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                helperText="Choose a unique name for your character"
                            />

                            {/* Select */}
                            <WesternSelect
                                label="Character Class"
                                value={formData.characterClass}
                                onChange={(e) => setFormData({ ...formData, characterClass: e.target.value })}
                                options={[
                                    { value: 'adventurer', label: 'Adventurer' },
                                    { value: 'duelist', label: 'Duelist' },
                                    { value: 'worker', label: 'Worker' },
                                    { value: 'soldier', label: 'Soldier' }
                                ]}
                                required
                            />

                            {/* Checkbox */}
                            <WesternCheckbox
                                label="I accept the terms and conditions of the Wild West"
                                checked={formData.acceptTerms}
                                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                            />

                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <WesternButton type="submit" variant="primary">
                                    Submit Form
                                </WesternButton>
                                <WesternButton
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setFormData({
                                        username: '',
                                        characterClass: 'adventurer',
                                        acceptTerms: false
                                    })}
                                >
                                    Reset
                                </WesternButton>
                            </div>
                        </div>
                    </form>
                </ParchmentPanel>

                {/* Toast Notifications Section */}
                <ParchmentPanel title="Toast Notifications">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
                        <WesternButton
                            size="sm"
                            onClick={() => toast.success('Success! Everything is working great.')}>
                            Show Success
                        </WesternButton>
                        <WesternButton
                            size="sm"
                            variant="danger"
                            onClick={() => toast.error('Error! Something went wrong.')}>
                            Show Error
                        </WesternButton>
                        <WesternButton
                            size="sm"
                            variant="secondary"
                            onClick={() => toast.warning('Warning! Be careful with this action.')}>
                            Show Warning
                        </WesternButton>
                        <WesternButton
                            size="sm"
                            variant="secondary"
                            onClick={() => toast.info('Info: This is an informational message.')}>
                            Show Info
                        </WesternButton>
                    </div>

                    <p style={{
                        marginTop: 'var(--space-5)',
                        padding: 'var(--space-3)',
                        background: 'rgba(107,68,35,0.1)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontStyle: 'italic'
                    }}>
                        💡 Click on a toast to dismiss it manually, or wait 3 seconds for auto-dismiss.
                    </p>
                </ParchmentPanel>

            </div>
        </div>
    );
};
