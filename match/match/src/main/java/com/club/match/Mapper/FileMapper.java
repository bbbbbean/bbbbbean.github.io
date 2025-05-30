package com.club.match.Mapper;


import com.club.match.Domain.DTO.AttachmentFileDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FileMapper {
    int uploadFile(AttachmentFileDTO attachmentFileDTO);

    int deleteFile(Long postAttachmentId);

    AttachmentFileDTO selectAt(Long postAttachmentId);

    String chatFileDownload(String fileName);
}
