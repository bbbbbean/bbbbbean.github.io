package com.club.match.Mapper;


import com.club.match.Domain.DTO.AttachmentFileDTO;

public interface FileMapper {
    int uploadFile(AttachmentFileDTO attachmemtFileDTO);

    int deleteFile(Long postAttachmentId);

    AttachmentFileDTO selectAt(Long postAttachmentId);
}
