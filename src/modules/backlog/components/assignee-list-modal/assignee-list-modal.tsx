import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { PtItem, PtUser } from "../../../../core/models/domain";
import { PtNewItem } from "../../../../shared/models/dto/pt-new-item";

export type AssigneeListModalProps = {
    modalIsShowing: boolean;
    setModalIsShowing: React.Dispatch<React.SetStateAction<boolean>>;
    users: PtUser[];
    selectAssignee: (user: PtUser) => void;
};


export function AssigneeListModal(props: AssigneeListModalProps) {

    const { modalIsShowing, setModalIsShowing, users, selectAssignee } = props;

    return (
        <Modal isOpen={modalIsShowing}>
            <div className="modal-header">
                <h4 className="modal-title" id="modal-basic-title">Select Assignee</h4>
                <button type="button" className="close" onClick={() => setModalIsShowing(false)} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <ModalBody>
                <ul className="list-group list-group-flush">
                    {
                        users.map((u: PtUser) => {
                            return (
                                <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center" onClick={() => selectAssignee(u)}>
                                    <span>{u.fullName}</span>
                                    <span className="badge ">
                                        <img src={u.avatar} className="li-avatar rounded mx-auto d-block" />
                                    </span>
                                </li>
                            );
                        })
                    }
                </ul>
            </ModalBody>
            <ModalFooter />
        </Modal>
    );
}